import { Outlet, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AppHome from "./AppHome";
import AppChat from "./AppChat";
import AppScrape from "./AppScrape";
import AppResults from "./AppResults";
import AppLists from "./AppLists";
import AppListDetail from "./AppListDetail";
import AppSettings from "./AppSettings";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/app/home" replace />} />
            <Route path="/home" element={<AppHome />} />
            <Route path="/chat" element={<AppChat />} />
            <Route path="/businesses" element={<AppScrape />} />
            <Route path="/results" element={<AppResults />} />
            <Route path="/lists" element={<AppLists />} />
            <Route path="/lists/:id" element={<AppListDetail />} />
            <Route path="/settings" element={<AppSettings />} />
            <Route path="*" element={<Navigate to="/app/home" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}
