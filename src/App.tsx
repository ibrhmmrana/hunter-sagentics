import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import AppLayout from "./pages/AppLayout";
import AppHome from "./pages/AppHome";
import AppChat from "./pages/AppChat";
import AppScrape from "./pages/AppScrape";
import AppResults from "./pages/AppResults";
import AppLists from "./pages/AppLists";
import AppSettings from "./pages/AppSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/home" replace />} />
            <Route path="home" element={<AppHome />} />
            <Route path="chat" element={<AppChat />} />
            <Route path="scrape" element={<AppScrape />} />
            <Route path="results" element={<AppResults />} />
            <Route path="lists" element={<AppLists />} />
            <Route path="settings" element={<AppSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
