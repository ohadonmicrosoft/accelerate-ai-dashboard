import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  steps: jsonb("steps").notNull(),
  userId: integer("user_id").notNull(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  isAi: boolean("is_ai").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertWorkflowSchema = createInsertSchema(workflows);
export const insertReportSchema = createInsertSchema(reports);
export const insertChatSchema = createInsertSchema(chatHistory);

export type User = typeof users.$inferSelect;
export type Workflow = typeof workflows.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type ChatMessage = typeof chatHistory.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type InsertChat = z.infer<typeof insertChatSchema>;
