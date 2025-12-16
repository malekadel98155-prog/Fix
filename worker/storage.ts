/// <reference types="@cloudflare/workers-types" />

export interface IStorage {
  getUserUsageToday(userId: string): Promise<number>;
  incrementUserUsage(userId: string): Promise<void>;
  canUserSendMessage(userId: string, dailyLimit: number): Promise<boolean>;
}

export class D1Storage implements IStorage {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  async getUserUsageToday(userId: string): Promise<number> {
    const today = this.getToday();
    
    const result = await this.db
      .prepare('SELECT message_count FROM usage_tracking WHERE user_id = ? AND date = ?')
      .bind(userId, today)
      .first<{ message_count: number }>();
    
    return result?.message_count || 0;
  }

  async incrementUserUsage(userId: string): Promise<void> {
    const today = this.getToday();
    
    const existing = await this.db
      .prepare('SELECT id, message_count FROM usage_tracking WHERE user_id = ? AND date = ?')
      .bind(userId, today)
      .first<{ id: string; message_count: number }>();

    if (existing) {
      await this.db
        .prepare('UPDATE usage_tracking SET message_count = ?, last_message_at = datetime("now") WHERE id = ?')
        .bind(existing.message_count + 1, existing.id)
        .run();
    } else {
      const id = crypto.randomUUID();
      await this.db
        .prepare('INSERT INTO usage_tracking (id, user_id, date, message_count, last_message_at) VALUES (?, ?, ?, 1, datetime("now"))')
        .bind(id, userId, today)
        .run();
    }
  }

  async canUserSendMessage(userId: string, dailyLimit: number): Promise<boolean> {
    const currentUsage = await this.getUserUsageToday(userId);
    return currentUsage < dailyLimit;
  }
}
