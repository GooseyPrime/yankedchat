import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status"),
  plan: text("plan").default("free"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatExtractions = pgTable("chat_extractions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  platform: text("platform").notNull(), // chatgpt, claude, gemini, copilot
  url: text("url").notNull(),
  status: text("status").notNull(), // pending, completed, failed
  extractedContent: jsonb("extracted_content"),
  messageCount: integer("message_count"),
  errorMessage: text("error_message"),
  exportFormat: text("export_format"), // json, markdown, text, pdf
  createdAt: timestamp("created_at").defaultNow(),
});

export const parsingErrors = pgTable("parsing_errors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  errorType: text("error_type").notNull(), // interface_change, parsing_failure
  errorDetails: jsonb("error_details"),
  notificationSent: boolean("notification_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertExtractionSchema = createInsertSchema(chatExtractions).pick({
  url: true,
  exportFormat: true,
}).extend({
  platform: z.string().optional(), // Platform will be auto-detected from URL
});

export const insertParsingErrorSchema = createInsertSchema(parsingErrors).pick({
  platform: true,
  url: true,
  errorType: true,
  errorDetails: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertExtraction = z.infer<typeof insertExtractionSchema>;
export type ChatExtraction = typeof chatExtractions.$inferSelect;
export type InsertParsingError = z.infer<typeof insertParsingErrorSchema>;
export type ParsingError = typeof parsingErrors.$inferSelect;
