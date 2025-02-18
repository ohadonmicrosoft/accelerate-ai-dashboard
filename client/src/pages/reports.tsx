import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateBusinessReport } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const mockReports = [
  {
    id: "1",
    title: "Q1 2024 Performance Analysis",
    summary: "Strong growth in revenue and customer acquisition",
    insights: [
      "20% increase in revenue compared to Q4 2023",
      "Customer satisfaction score improved by 15%",
      "New product line contributed to 30% of sales"
    ]
  },
  {
    id: "2",
    title: "Market Opportunity Analysis",
    summary: "Identified key growth areas in emerging markets",
    insights: [
      "APAC region shows highest growth potential",
      "B2B segment outperforming B2C by 25%",
      "Mobile-first strategy driving engagement"
    ]
  }
];

export default function Reports() {
  const [reports, setReports] = useState(mockReports);
  const { toast } = useToast();

  async function generateNewReport() {
    try {
      const mockData = {
        revenue: 1500000,
        customers: 1200,
        satisfaction: 4.5
      };

      const report = await generateBusinessReport(mockData);

      setReports(prev => [
        {
          id: String(prev.length + 1),
          title: "New Business Report",
          summary: report.summary,
          insights: report.insights
        },
        ...prev
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button onClick={generateNewReport}>
          Generate New Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map(report => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{report.summary}</p>
              <div className="space-y-2">
                <h4 className="font-medium">Key Insights</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {report.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}