import { 
  type User, type InsertUser,
  type Workflow, type InsertWorkflow,
  type Report, type InsertReport,
  type ChatMessage, type InsertChat
} from "@shared/schema";
import { db } from "./db";
import { users, workflows, reports, chatHistory } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Workflow operations
  getWorkflows(userId?: number): Promise<Workflow[]>;
  getWorkflow(id: number): Promise<Workflow | undefined>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;

  // Report operations
  getReports(userId?: number): Promise<Report[]>;
  getReport(id: number): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;

  // Chat operations
  getChatHistory(userId: number): Promise<ChatMessage[]>;
  createChatMessage(chat: InsertChat): Promise<ChatMessage>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return user;
  }

  // Workflow operations
  async getWorkflows(userId?: number): Promise<Workflow[]> {
    const query = db.select().from(workflows);
    if (userId !== undefined) {
      query.where(eq(workflows.userId, userId));
    }
    return await query;
  }

  async getWorkflow(id: number): Promise<Workflow | undefined> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    return workflow;
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const [workflow] = await db
      .insert(workflows)
      .values({
        ...insertWorkflow,
        createdAt: new Date(),
      })
      .returning();
    return workflow;
  }

  // Report operations
  async getReports(userId?: number): Promise<Report[]> {
    const query = db.select().from(reports);
    if (userId !== undefined) {
      query.where(eq(reports.userId, userId));
    }
    return await query;
  }

  async getReport(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report;
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const [report] = await db
      .insert(reports)
      .values({
        ...insertReport,
        createdAt: new Date(),
      })
      .returning();
    return report;
  }

  // Chat operations
  async getChatHistory(userId: number): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatHistory)
      .where(eq(chatHistory.userId, userId))
      .orderBy(chatHistory.timestamp);
  }

  async createChatMessage(insertChat: InsertChat): Promise<ChatMessage> {
    const [chat] = await db
      .insert(chatHistory)
      .values({
        ...insertChat,
        timestamp: new Date(),
      })
      .returning();
    return chat;
  }
}

export const storage = new DatabaseStorage();