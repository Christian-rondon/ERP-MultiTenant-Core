import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TrialGuard } from "@/components/TrialGuard";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Pos from "@/pages/Pos";
import Sales from "@/pages/Sales";
import Reports from "@/pages/Reports";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, allowedRoles, ...rest }: any) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-background"><div className="animate-pulse w-12 h-12 rounded-full bg-primary/20 border-4 border-primary"></div></div>;
  if (!user) return <Redirect to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Redirect to="/" />;

  return <Component {...rest} />;
}

function RootRedirect() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null;
  if (!user) return <Redirect to="/login" />;
  
  if (user.role === "DEVELOPER") return <Redirect to="/users" />;
  if (user.role === "DUENO") return <Redirect to="/dashboard" />;
  return <Redirect to="/pos" />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={RootRedirect} />
      
      <Route path="/:rest*">
        <Layout>
          <Switch>
            <Route path="/dashboard">
              {() => <ProtectedRoute component={Dashboard} allowedRoles={["DUENO"]} />}
            </Route>
            <Route path="/inventory">
              {() => <ProtectedRoute component={Inventory} allowedRoles={["DUENO", "CAJERA"]} />}
            </Route>
            <Route path="/pos">
              {() => <ProtectedRoute component={Pos} allowedRoles={["CAJERA"]} />}
            </Route>
            <Route path="/sales">
              {() => <ProtectedRoute component={Sales} allowedRoles={["DUENO"]} />}
            </Route>
            <Route path="/reports">
              {() => <ProtectedRoute component={Reports} allowedRoles={["DUENO"]} />}
            </Route>
            <Route path="/users">
              {() => <ProtectedRoute component={Users} allowedRoles={["DEVELOPER"]} />}
            </Route>
            <Route path="/settings">
              {() => <ProtectedRoute component={Settings} allowedRoles={["DEVELOPER"]} />}
            </Route>
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <TrialGuard>
            <Router />
          </TrialGuard>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
