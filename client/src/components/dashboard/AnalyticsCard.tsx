import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: number;
  data: { name: string; value: number }[];
  prefix?: string;
  suffix?: string;
  isLoading?: boolean;
}

export function AnalyticsCard({ 
  title, 
  value, 
  change, 
  data,
  prefix = "",
  suffix = "",
  isLoading = false
}: AnalyticsCardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-[80px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <motion.span 
            className={cn(
              "text-sm font-bold",
              change > 0 ? "text-emerald-500" : "text-rose-500"
            )}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {change > 0 ? "+" : ""}{change}%
          </motion.span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">
            {prefix}{value}{suffix}
          </div>
          <div className="h-[80px] mt-4 transition-opacity duration-200 group-hover:opacity-100">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${prefix}${value}${suffix}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-card p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="font-medium">{label}</span>
                            <span className="font-medium text-right">
                              {prefix}{payload[0].value}{suffix}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}