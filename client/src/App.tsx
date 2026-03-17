import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { isFirstVisit } from "@/lib/storage";
import WelcomePage from "@/pages/WelcomePage";
import AppPage from "@/pages/AppPage";
import ResultPage from "@/pages/ResultPage";

function Router() {
  return (
    <Switch>
      {/* 根路径：首次访问显示欢迎页，回访直接进 App */}
      <Route path="/">
        {() => isFirstVisit() ? <WelcomePage /> : <Redirect to="/app" />}
      </Route>

      {/* 主 App（含 Tab 导航） */}
      <Route path="/app" component={AppPage} />

      {/* 检测结果详情 */}
      <Route path="/result/:id" component={ResultPage} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster position="top-center" />
        <Router />
      </TooltipProvider>
    </ErrorBoundary>
  );
}
