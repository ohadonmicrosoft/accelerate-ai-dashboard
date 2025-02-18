import { 
  type User, type InsertUser,
  type Workflow, type InsertWorkflow,
  type Report, type InsertReport,
  type ChatMessage, type InsertChat
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workflows: Map<number, Workflow>;
  private reports: Map<number, Report>;
  private chats: Map<number, ChatMessage>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.workflows = new Map();
    this.reports = new Map();
    this.chats = new Map();
    this.currentId = {
      users: 1,
      workflows: 1,
      reports: 1,
      chats: 1
    };
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Workflow operations
  async getWorkflows(userId?: number): Promise<Workflow[]> {
    const workflows = Array.from(this.workflows.values());
    if (userId) {
      return workflows.filter(w => w.userId === userId);
    }
    return workflows;
  }

  async getWorkflow(id: number): Promise<Workflow | undefined> {
    return this.workflows.get(id);
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const id = this.currentId.workflows++;
    const workflow = { ...insertWorkflow, id };
    this.workflows.set(id, workflow);
    return workflow;
  }

  // Report operations
  async getReports(userId?: number): Promise<Report[]> {
    const reports = Array.from(this.reports.values());
    if (userId) {
      return reports.filter(r => r.userId === userId);
    }
    return reports;
  }

  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentId.reports++;
    const report = { 
      ...insertReport, 
      id,
      createdAt: new Date() 
    };
    this.reports.set(id, report);
    return report;
  }

  // Chat operations
  async getChatHistory(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chats.values())
      .filter(chat => chat.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createChatMessage(insertChat: InsertChat): Promise<ChatMessage> {
    const id = this.currentId.chats++;
    const chat = {
      ...insertChat,
      id,
      timestamp: new Date()
    };
    this.chats.set(id, chat);
    return chat;
  }
}

export const storage = new MemStorage();
