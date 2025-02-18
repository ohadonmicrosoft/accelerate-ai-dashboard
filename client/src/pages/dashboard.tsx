import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsCard } from "@/components/dashboard/AnalyticsCard";
import { ChatbotPanel } from "@/components/dashboard/ChatbotPanel";
import { WorkflowCard } from "@/components/dashboard/WorkflowCard";

const generateMockData = (points = 5) => {
  return Array.from({ length: points }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May"][i],
    value: Math.floor(Math.random() * 1000)
  }));
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const analyticsData = [
    {
      title: "Total Revenue",
      value: "$48,560",
      change: 12.5,
      data: generateMockData(),
      prefix: "$"
    },
    {
      title: "Active Customers",
      value: "2,420",
      change: 8.2,
      data: generateMockData()
    },
    {
      title: "Projects Completed",
      value: "182",
      change: 24.5,
      data: generateMockData()
    },
    {
      title: "Task Completion Rate",
      value: "92.6",
      change: 5.3,
      data: generateMockData(),
      suffix: "%"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-display">Welcome Back</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-12" />
              <Skeleton className="h-[80px]" />
            </div>
          ))
        ) : (
          analyticsData.map((item, index) => (
            <AnalyticsCard
              key={index}
              title={item.title}
              value={item.value}
              change={item.change}
              data={item.data}
              prefix={item.prefix}
              suffix={item.suffix}
            />
          ))
        )}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ChatbotPanel />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <WorkflowCard
            title="Recent Workflows"
            steps={[
              {
                id: "1",
                title: "Data Analysis",
                description: "Analyzing customer behavior patterns"
              },
              {
                id: "2",
                title: "Report Generation",
                description: "Creating monthly performance reports"
              }
            ]}
            onOptimize={() => {}}
          />
        </motion.div>
      </div>
    </div>
  );
}