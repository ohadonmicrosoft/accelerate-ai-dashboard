import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowCard } from "@/components/dashboard/WorkflowCard";
import { optimizeWorkflow } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const mockWorkflows = [
  {
    id: "1",
    title: "Customer Onboarding",
    steps: [
      {
        id: "1-1",
        title: "Initial Contact",
        description: "Schedule welcome call with new customer"
      },
      {
        id: "1-2",
        title: "Requirements Gathering",
        description: "Document customer needs and expectations"
      },
      {
        id: "1-3",
        title: "Account Setup",
        description: "Create and configure customer account"
      }
    ]
  },
  {
    id: "2",
    title: "Invoice Processing",
    steps: [
      {
        id: "2-1",
        title: "Document Receipt",
        description: "Receive and validate invoice documents"
      },
      {
        id: "2-2",
        title: "Data Extraction",
        description: "Extract key information using AI"
      },
      {
        id: "2-3",
        title: "Payment Processing",
        description: "Process payment and update records"
      }
    ]
  }
];

export default function Workflows() {
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const { toast } = useToast();

  async function handleOptimize(workflowId: string) {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    try {
      const { optimizedSteps, improvements } = await optimizeWorkflow(workflow);
      
      toast({
        title: "Workflow Optimized",
        description: improvements[0]
      });

      setWorkflows(prev =>
        prev.map(w =>
          w.id === workflowId
            ? { ...w, steps: optimizedSteps }
            : w
        )
      );
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Could not optimize workflow",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workflows</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Workflow
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {workflows.map(workflow => (
          <WorkflowCard
            key={workflow.id}
            title={workflow.title}
            steps={workflow.steps}
            onOptimize={() => handleOptimize(workflow.id)}
          />
        ))}
      </div>
    </div>
  );
}