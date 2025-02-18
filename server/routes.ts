import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkflowSchema, insertReportSchema, insertChatSchema } from "@shared/schema";
import { getChatResponse, generateBusinessReport, optimizeWorkflow } from "./services/ai";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/workflows", async (req, res) => {
    const workflows = await storage.getWorkflows();
    res.json(workflows);
  });

  app.post("/api/workflows", async (req, res) => {
    const result = insertWorkflowSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid workflow data" });
      return;
    }
    const workflow = await storage.createWorkflow(result.data);
    res.json(workflow);
  });

  app.get("/api/reports", async (req, res) => {
    const reports = await storage.getReports();
    res.json(reports);
  });

  app.post("/api/reports", async (req, res) => {
    const result = insertReportSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid report data" });
      return;
    }
    const report = await storage.createReport(result.data);
    res.json(report);
  });

  app.get("/api/chat/:userId", async (req, res) => {
    const chats = await storage.getChatHistory(parseInt(req.params.userId));
    res.json(chats);
  });

  app.post("/api/chat", async (req, res) => {
    const result = insertChatSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid chat data" });
      return;
    }
    const chat = await storage.createChatMessage(result.data);
    res.json(chat);
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        res.status(400).json({ error: "Prompt is required" });
        return;
      }
      const response = await getChatResponse(prompt);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  app.post("/api/ai/report", async (req, res) => {
    try {
      const { data } = req.body;
      if (!data) {
        res.status(400).json({ error: "Data is required" });
        return;
      }
      const report = await generateBusinessReport(data);
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  app.post("/api/ai/workflow/optimize", async (req, res) => {
    try {
      const { workflow } = req.body;
      if (!workflow) {
        res.status(400).json({ error: "Workflow is required" });
        return;
      }
      const optimized = await optimizeWorkflow(workflow);
      res.json(optimized);
    } catch (error) {
      res.status(500).json({ error: "Failed to optimize workflow" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}