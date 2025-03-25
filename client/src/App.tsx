import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { useKeyboardMode } from "./hooks/use-keyboard-mode";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Enable keyboard navigation detection
  useKeyboardMode();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Skip to content link for keyboard users */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
