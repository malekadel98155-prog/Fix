import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, AlertCircle, Loader2, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { sendMessageToAI, ChatMessage, getUserUsage, UsageInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = async () => {
    try {
      const usageData = await getUserUsage();
      setUsage(usageData);
    } catch (error) {
      console.error("Failed to load usage:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessageToAI([...messages, userMessage]);
      
      const botMessage: ChatMessage = { 
        role: "assistant", 
        content: response.content 
      };
      setMessages((prev) => [...prev, botMessage]);
      
      if (response.usage) {
        setUsage(response.usage);
      }
    } catch (error: any) {
      const errorMessage = error.message || "فشل الاتصال بـ Fix It AI";
      
      if (errorMessage.includes("Daily message limit reached") || errorMessage.includes("429")) {
        toast({
          title: "تم الوصول إلى الحد اليومي",
          description: "لقد استخدمت جميع رسائلك اليومية (100 رسالة). سيتم إعادة تعيين الحد غدًا.",
          variant: "destructive",
        });
        await loadUsage();
      } else {
        toast({
          title: "خطأ في الاتصال",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-4xl mx-auto border-zinc-800 bg-zinc-950/50 backdrop-blur-sm shadow-2xl overflow-hidden rounded-xl">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Bot className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h2 className="font-mono font-bold text-lg text-cyan-500 tracking-tight">Fix It AI</h2>
            <p className="text-xs text-zinc-500 font-medium">Problem Solver</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {usage && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700">
              <BarChart3 className="w-3 h-3 text-cyan-500" />
              <span className="text-xs font-mono text-zinc-300">
                {usage.remaining}/{usage.limit}
              </span>
            </div>
          )}
          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-mono animate-pulse">
            ONLINE
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
            <Bot className="w-12 h-12 opacity-20" />
            <p className="text-sm font-mono">Describe your problem to Fix It AI...</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                ${msg.role === "user" ? "bg-zinc-800" : "bg-cyan-500/10 border border-cyan-500/20"}
              `}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-500" />}
              </div>
              
              <div className={`
                max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                ${msg.role === "user" 
                  ? "bg-zinc-800 text-zinc-100 rounded-tr-none" 
                  : "bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-tl-none"}
              `}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.role === "assistant" && (
                  <div className="mt-2 pt-2 border-t border-zinc-800/50 flex items-center gap-1 text-[10px] text-cyan-500/50 font-mono uppercase tracking-wider">
                    <span>Fix It AI</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl rounded-tl-none px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your problem..."
            className="bg-zinc-950 border-zinc-800 focus-visible:ring-cyan-500/50 font-mono text-sm text-white"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </Card>
  );
}
