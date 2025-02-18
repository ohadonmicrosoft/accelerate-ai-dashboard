import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { DefaultLayout } from "@/components/layout/DefaultLayout";
import Dashboard from "@/pages/dashboard";
import Workflows from "@/pages/workflows";
import Reports from "@/pages/reports";
import Chatbot from "@/pages/chatbot";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <DefaultLayout>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/workflows" component={Workflows} />
        <Route path="/reports" component={Reports} />
        <Route path="/chatbot" component={Chatbot} />
        <Route path="/" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </DefaultLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
