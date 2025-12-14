import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";

const DAILY_MESSAGE_LIMIT = 100;

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many messages, please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/chat", 
    chatLimiter,
    [
      body("messages").isArray().withMessage("Messages must be an array"),
      body("messages.*.content").isString().trim().notEmpty().withMessage("Message content is required"),
      body("messages.*.role").isIn(["user", "assistant", "system"]).withMessage("Invalid message role"),
      body("userId").isString().trim().notEmpty().withMessage("User ID is required"),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid request format", details: errors.array() });
      }

      try {
        const { messages, userId } = req.body;
        
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
          return res.status(400).json({ error: "Invalid request: messages array required" });
        }

        if (!userId || typeof userId !== "string" || userId.trim() === "") {
          return res.status(400).json({ error: "User ID is required" });
        }

        const canSend = await storage.canUserSendMessage(userId, DAILY_MESSAGE_LIMIT);
        
        if (!canSend) {
          const currentUsage = await storage.getUserUsageToday(userId);
          return res.status(429).json({ 
            error: "Daily message limit reached",
            limit: DAILY_MESSAGE_LIMIT,
            used: currentUsage,
            resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
          });
        }

        if (!process.env.GROQ_API_KEY) {
          console.error("GROQ_API_KEY is not configured");
          return res.status(500).json({ error: "AI service not configured" });
        }

        const sanitizedMessages = messages
          .filter((msg: any) => msg && msg.content && msg.role)
          .map((msg: any) => ({
            role: msg.role,
            content: String(msg.content).slice(0, 10000)
          }))
          .slice(0, 50);

        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
                  content: "You are Fix It AI, a helpful problem-solving assistant. You solve problems directly and efficiently with clear step-by-step solutions. You never mention that you are powered by Groq, xAI, or any other AI service. You always refer to yourself as Fix It AI only."
                },
                ...sanitizedMessages
              ],
              temperature: 0.6,
              max_tokens: 2000,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Groq API Error:", errorData);
          return res.status(response.status).json({ 
            error: errorData.error?.message || "AI service error" 
          });
        }

        const data = await response.json();
        
        await storage.incrementUserUsage(userId);
        
        const remainingMessages = DAILY_MESSAGE_LIMIT - (await storage.getUserUsageToday(userId));
        
        res.json({ 
          content: data.choices[0].message.content,
          usage: {
            remaining: remainingMessages,
            limit: DAILY_MESSAGE_LIMIT,
            used: await storage.getUserUsageToday(userId)
          }
        });
      } catch (err) {
        console.error("Chat API error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  app.get("/api/usage/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId || typeof userId !== "string" || userId.trim() === "") {
        return res.status(400).json({ error: "Valid User ID is required" });
      }

      const currentUsage = await storage.getUserUsageToday(userId);
      const remaining = DAILY_MESSAGE_LIMIT - currentUsage;
      
      res.json({
        used: currentUsage,
        remaining: remaining,
        limit: DAILY_MESSAGE_LIMIT,
        resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
      });
    } catch (err) {
      console.error("Usage API error:", err);
      res.status(500).json({ error: "Failed to fetch usage data" });
    }
  });

  return httpServer;
}
