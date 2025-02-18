import { useState } from "react";
import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getChatResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Message {
  content: string;
  isAi: boolean;
}

export function ChatbotPanel() {
  const [messages, setMessages] = useState<Message[]>([{
    content: "Hello! I'm your AccelerateAI assistant. I can help you analyze your business data, generate reports, and provide personalized recommendations. How can I assist you today?",
    isAi: true
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = { content: input, isAi: false };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // TODO: Get user data from context/state
      const userData = {
        // This will be populated with actual user data
        businessMetrics: {},
        recentActivities: [],
        preferences: {}
      };

      const response = await getChatResponse(input, userData);
      const aiMessage = { content: response, isAi: true };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex h-[600px] flex-col">
      <CardHeader>
        <CardTitle>AI Business Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1">
          <div className="space-y-4 p-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={cn(
                  "flex w-max max-w-[80%] rounded-lg px-4 py-2",
                  message.isAi
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground ml-auto"
                )}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your business..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button 
            onClick={handleSend} 
            disabled={loading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}