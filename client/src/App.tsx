import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { DefaultLayout } from "@/components/layout/DefaultLayout";
import "./lib/firebase"; // Import firebase initialization

// Import pages
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Workflows from "@/pages/workflows";
import Reports from "@/pages/reports";
import Chatbot from "@/pages/chatbot";
import AuthPage from "@/pages/auth";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/" component={LandingPage} />

      {/* Protected routes wrapped in DefaultLayout */}
      <Route>
        <DefaultLayout>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/workflows" component={Workflows} />
            <Route path="/reports" component={Reports} />
            <Route path="/chatbot" component={Chatbot} />
            <Route component={NotFound} />
          </Switch>
        </DefaultLayout>
      </Route>
    </Switch>
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