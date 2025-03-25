import { Switch, Route } from "wouter";
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
    <>
      {/* Skip to content link for keyboard users */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <Router />
    </>
  );
}

export default App;
