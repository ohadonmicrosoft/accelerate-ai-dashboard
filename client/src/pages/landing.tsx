import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronRight,
  BarChart2,
  Brain,
  Workflow,
  MessageSquare
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: BarChart2,
      title: "Advanced Analytics",
      description: "Transform complex data into actionable insights with AI-powered analytics."
    },
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Get personalized recommendations and insights from our intelligent AI assistant."
    },
    {
      icon: Workflow,
      title: "Workflow Automation",
      description: "Streamline your business processes with intelligent workflow automation."
    },
    {
      icon: MessageSquare,
      title: "Smart Chatbot",
      description: "Engage with an AI chatbot that understands your business context."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 sm:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight sm:text-6xl"
            >
              Transform Your Business with
              <span className="text-primary"> AI-Powered</span> Intelligence
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground"
            >
              AccelerateAI helps businesses make better decisions with advanced analytics,
              intelligent automation, and personalized insights.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex items-center justify-center gap-4"
            >
              <Link href="/auth">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline">
                  Live Demo
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-background [mask-image:radial-gradient(circle_at_center,transparent_20%,black)]" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-16">
            Powerful Features for Your Business
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
