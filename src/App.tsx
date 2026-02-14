import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardHome from "./pages/DashboardHome";
import TransactionsPage from "./pages/TransactionsPage";
import InvestmentsPage from "./pages/InvestmentsPage";
import TaxPlannerPage from "./pages/TaxPlannerPage";
import GoalsPage from "./pages/GoalsPage";
import InsightsPage from "./pages/InsightsPage";
import SettingsPage from "./pages/SettingsPage";
import DashboardLayout from "./components/DashboardLayout";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

const DashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardRoute><DashboardHome /></DashboardRoute>} />
            <Route path="/dashboard/transactions" element={<DashboardRoute><TransactionsPage /></DashboardRoute>} />
            <Route path="/dashboard/investments" element={<DashboardRoute><InvestmentsPage /></DashboardRoute>} />
            <Route path="/dashboard/tax" element={<DashboardRoute><TaxPlannerPage /></DashboardRoute>} />
            <Route path="/dashboard/goals" element={<DashboardRoute><GoalsPage /></DashboardRoute>} />
            <Route path="/dashboard/insights" element={<DashboardRoute><InsightsPage /></DashboardRoute>} />
            <Route path="/dashboard/settings" element={<DashboardRoute><SettingsPage /></DashboardRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
