/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  GROQ_API_KEY: string;
  DAILY_MESSAGE_LIMIT: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface UsageTracking {
  id: string;
  user_id: string;
  date: string;
  message_count: number;
  last_message_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  userId: string;
}

export interface ChatResponse {
  content: string;
  usage: {
    remaining: number;
    limit: number;
    used: number;
  };
}

export interface UsageResponse {
  used: number;
  remaining: number;
  limit: number;
  resetTime: string;
}

export interface ErrorResponse {
  error: string;
  details?: unknown;
  limit?: number;
  used?: number;
  resetTime?: string;
}
