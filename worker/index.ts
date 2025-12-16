/// <reference types="@cloudflare/workers-types" />
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { z } from 'zod';
import { D1Storage } from './storage.js';

type Bindings = {
  DB: D1Database;
  GROQ_API_KEY: string;
  DAILY_MESSAGE_LIMIT: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', logger());

app.use('*', cors({
  origin: ['*'],
  credentials: true,
}));

const messageSchema = z.object({
  content: z.string().min(1).max(10000),
  role: z.enum(['user', 'assistant', 'system']),
});

const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
  userId: z.string().min(1),
});

app.post('/api/chat', async (c) => {
  try {
    const body = await c.req.json();
    
    const validation = chatRequestSchema.safeParse(body);
    if (!validation.success) {
      return c.json({ 
        error: 'Invalid request format', 
        details: validation.error.errors 
      }, 400);
    }

    const { messages, userId } = validation.data;
    const storage = new D1Storage(c.env.DB);
    const dailyLimit = parseInt(c.env.DAILY_MESSAGE_LIMIT || '100', 10);

    const canSend = await storage.canUserSendMessage(userId, dailyLimit);
    
    if (!canSend) {
      const currentUsage = await storage.getUserUsageToday(userId);
      const resetTime = new Date();
      resetTime.setHours(24, 0, 0, 0);
      
      return c.json({ 
        error: 'Daily message limit reached',
        limit: dailyLimit,
        used: currentUsage,
        resetTime: resetTime.toISOString()
      }, 429);
    }

    if (!c.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not configured');
      return c.json({ error: 'AI service not configured' }, 500);
    }

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are Fix It AI, a helpful problem-solving assistant. You solve problems directly and efficiently with clear step-by-step solutions. You never mention that you are powered by Groq, xAI, or any other AI service. You always refer to yourself as Fix It AI only.'
            },
            ...messages
          ],
          temperature: 0.6,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', errorData);
      return c.json({ 
        error: (errorData as any).error?.message || 'AI service error' 
      }, response.status as any);
    }

    const data = await response.json() as any;
    
    await storage.incrementUserUsage(userId);
    
    const currentUsage = await storage.getUserUsageToday(userId);
    const remainingMessages = dailyLimit - currentUsage;
    
    return c.json({ 
      content: data.choices[0].message.content,
      usage: {
        remaining: remainingMessages,
        limit: dailyLimit,
        used: currentUsage
      }
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get('/api/usage/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    if (!userId || userId.trim() === '') {
      return c.json({ error: 'Valid User ID is required' }, 400);
    }

    const storage = new D1Storage(c.env.DB);
    const currentUsage = await storage.getUserUsageToday(userId);
    const dailyLimit = parseInt(c.env.DAILY_MESSAGE_LIMIT || '100', 10);
    const remaining = dailyLimit - currentUsage;
    
    const resetTime = new Date();
    resetTime.setHours(24, 0, 0, 0);
    
    return c.json({
      used: currentUsage,
      remaining: remaining,
      limit: dailyLimit,
      resetTime: resetTime.toISOString()
    });
  } catch (err) {
    console.error('Usage API error:', err);
    return c.json({ error: 'Failed to fetch usage data' }, 500);
  }
});

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
