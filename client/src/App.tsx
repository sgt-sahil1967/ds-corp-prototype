import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

import Landing from "@/pages/landing";
import RfqCreate from "@/pages/rfq-create";
import RfqConfirmation from "@/pages/rfq-confirmation";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import QuoteView from "@/pages/quote-view";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/rfq" component={RfqCreate} />
      <Route path="/rfq/confirmation/:id" component={RfqConfirmation} />
      <Route path="/quote/:id" component={QuoteView} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
