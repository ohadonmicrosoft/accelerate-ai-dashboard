import { apiRequest } from "./queryClient";

export async function getChatResponse(prompt: string, userData?: any): Promise<string> {
  const res = await apiRequest("POST", "/api/ai/chat", { prompt, userData });
  const data = await res.json();
  return data.response;
}

export async function generateBusinessReport(data: any): Promise<{
  summary: string;
  insights: string[];
  recommendations: string[];
}> {
  const res = await apiRequest("POST", "/api/ai/report", { data });
  return res.json();
}

export async function optimizeWorkflow(workflow: any): Promise<{
  optimizedSteps: any[];
  improvements: string[];
}> {
  const res = await apiRequest("POST", "/api/ai/workflow/optimize", { workflow });
  return res.json();
}

export async function exportToDocument(data: any, format: 'pdf' | 'docx'): Promise<Blob> {
  const res = await apiRequest("POST", "/api/export/document", { data, format });
  return res.blob();
}