import { type User, type InsertUser, type ChatExtraction, type InsertExtraction, type ParsingError, type InsertParsingError, users, chatExtractions, parsingErrors } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User>;
  getAllUsers?(): Promise<User[]>;
  updateUserSubscription?(userId: string, updates: {
    stripeSubscriptionId?: string | null;
    subscriptionStatus?: string;
    plan?: string;
  }): Promise<User>;
  
  // Chat extraction methods
  createExtraction(extraction: InsertExtraction & { userId: string }): Promise<ChatExtraction>;
  getExtraction(id: string): Promise<ChatExtraction | undefined>;
  getUserExtractions(userId: string): Promise<ChatExtraction[]>;
  updateExtractionStatus(id: string, status: string, content?: any, messageCount?: number, errorMessage?: string): Promise<ChatExtraction>;
  
  // Parsing error methods
  createParsingError(error: InsertParsingError): Promise<ParsingError>;
  getUnnotifiedErrors(): Promise<ParsingError[]>;
  markErrorNotified(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: "active",
        plan: "pro"
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  async createExtraction(extraction: InsertExtraction & { userId: string }): Promise<ChatExtraction> {
    const [chatExtraction] = await db
      .insert(chatExtractions)
      .values({
        userId: extraction.userId,
        url: extraction.url,
        platform: extraction.platform || "unknown",
        exportFormat: extraction.exportFormat,
        status: "pending"
      })
      .returning();
    return chatExtraction;
  }

  async getExtraction(id: string): Promise<ChatExtraction | undefined> {
    const [extraction] = await db.select().from(chatExtractions).where(eq(chatExtractions.id, id));
    return extraction || undefined;
  }

  async getUserExtractions(userId: string): Promise<ChatExtraction[]> {
    return await db.select().from(chatExtractions).where(eq(chatExtractions.userId, userId));
  }

  async updateExtractionStatus(
    id: string, 
    status: string, 
    content?: any, 
    messageCount?: number, 
    errorMessage?: string
  ): Promise<ChatExtraction> {
    const updateData: any = { status };
    if (content !== undefined) updateData.extractedContent = content;
    if (messageCount !== undefined) updateData.messageCount = messageCount;
    if (errorMessage !== undefined) updateData.errorMessage = errorMessage;
    
    const [extraction] = await db
      .update(chatExtractions)
      .set(updateData)
      .where(eq(chatExtractions.id, id))
      .returning();
    
    if (!extraction) throw new Error("Extraction not found");
    return extraction;
  }

  async createParsingError(error: InsertParsingError): Promise<ParsingError> {
    const [parsingError] = await db
      .insert(parsingErrors)
      .values(error)
      .returning();
    return parsingError;
  }

  async getUnnotifiedErrors(): Promise<ParsingError[]> {
    return await db.select().from(parsingErrors).where(eq(parsingErrors.notificationSent, false));
  }

  async markErrorNotified(id: string): Promise<void> {
    await db
      .update(parsingErrors)
      .set({ notificationSent: true })
      .where(eq(parsingErrors.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUserSubscription(userId: string, updates: {
    stripeSubscriptionId?: string | null;
    subscriptionStatus?: string;
    plan?: string;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }
}

export const storage = new DatabaseStorage();
