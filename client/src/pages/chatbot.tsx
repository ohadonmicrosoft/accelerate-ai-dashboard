import { ChatbotPanel } from "@/components/dashboard/ChatbotPanel";

export default function Chatbot() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">AI Assistant</h1>
      <div className="max-w-4xl mx-auto">
        <ChatbotPanel />
      </div>
    </div>
  );
}
