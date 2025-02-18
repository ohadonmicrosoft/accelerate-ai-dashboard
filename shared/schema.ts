import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  steps: jsonb("steps").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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

// Create Zod schema for user validation
export const insertUserSchema = createInsertSchema(users).extend({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

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