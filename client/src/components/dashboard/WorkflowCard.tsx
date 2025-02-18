import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
}

interface WorkflowCardProps {
  title: string;
  steps: WorkflowStep[];
  onOptimize: () => void;
}

export function WorkflowCard({ title, steps, onOptimize }: WorkflowCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Button variant="outline" size="sm" onClick={onOptimize}>
          Optimize
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center gap-2 rounded-lg border bg-card p-4"
          >
            <DragHandleDots2Icon className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <div className="font-medium">{step.title}</div>
              <div className="text-sm text-muted-foreground">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
