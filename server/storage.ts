import { 
  type User, 
  type InsertUser,
  type UsageTracking,
  type InsertUsageTracking,
  users,
  usageTracking
} from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, sql } from "drizzle-orm";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserUsageToday(userId: string): Promise<number>;
  incrementUserUsage(userId: string): Promise<void>;
  canUserSendMessage(userId: string, dailyLimit: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getUserUsageToday(userId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const result = await db
      .select()
      .from(usageTracking)
      .where(
        and(
          eq(usageTracking.userId, userId),
          eq(usageTracking.date, today)
        )
      );
    
    return result[0]?.messageCount || 0;
  }

  async incrementUserUsage(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    const existing = await db
      .select()
      .from(usageTracking)
      .where(
        and(
          eq(usageTracking.userId, userId),
          eq(usageTracking.date, today)
        )
      );

    if (existing.length > 0) {
      await db
        .update(usageTracking)
        .set({ 
          messageCount: sql`${usageTracking.messageCount} + 1`,
          lastMessageAt: new Date()
        })
        .where(eq(usageTracking.id, existing[0].id));
    } else {
      await db.insert(usageTracking).values({
        userId,
        date: today,
        messageCount: 1,
      });
    }
  }

  async canUserSendMessage(userId: string, dailyLimit: number): Promise<boolean> {
    const currentUsage = await this.getUserUsageToday(userId);
    return currentUsage < dailyLimit;
  }
}

export const storage = new DatabaseStorage();
