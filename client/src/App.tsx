import { Switch, Route, Router } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <Router base="/Mylove">
      <AppRouter />
    </Router>
  );
}

export default App;
