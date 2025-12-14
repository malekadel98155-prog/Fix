// Secure API client for Fix It AI

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface UsageInfo {
  remaining: number;
  limit: number;
  used: number;
  resetTime?: string;
}

export interface ChatResponse {
  content: string;
  usage?: UsageInfo;
}

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export function getUserId(): string {
  let userId = localStorage.getItem("fixitai_user_id");
  
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem("fixitai_user_id", userId);
  }
  
  return userId;
}

export async function sendMessageToAI(messages: ChatMessage[]): Promise<ChatResponse> {
  try {
    const userId = getUserId();
    
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to send message to Fix It AI:", error);
    throw error;
  }
}

export async function getUserUsage(): Promise<UsageInfo> {
  try {
    const userId = getUserId();
    
    const response = await fetch(`/api/usage/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch usage: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user usage:", error);
    throw error;
  }
}
