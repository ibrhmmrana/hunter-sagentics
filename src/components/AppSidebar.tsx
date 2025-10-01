import { Home, MessageSquare, Search, FileText, FolderOpen, Settings, Plus, Gift, PanelLeftClose, PanelLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const mainNavItems = [
  { title: "Home", url: "/app/home", icon: Home },
  { title: "Chat", url: "/app/chat", icon: MessageSquare },
  { title: "Scrape", url: "/app/scrape", icon: Search },
  { title: "Results", url: "/app/results", icon: FileText },
  { title: "Lists", url: "/app/lists", icon: FolderOpen },
  { title: "Settings", url: "/app/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const creditsUsed = 310;
  const creditsTotal = 400;
  const creditsPercent = (creditsUsed / creditsTotal) * 100;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <div className="flex h-full flex-col">
        {/* Workspace Switcher */}
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                I
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Ibrahim Rana's...</p>
              </div>
            )}
            <SidebarTrigger className="h-6 w-6 shrink-0" />
          </div>
        </div>

        <SidebarContent className="flex-1">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "hover:bg-sidebar-accent/50"
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer with referral & credits */}
        {!isCollapsed && (
          <SidebarFooter className="p-4 space-y-4">
            <Card className="p-3 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-2 mb-2">
                <Gift className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Get $20 for every friend you refer.
                </p>
              </div>
            </Card>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Credits remaining</span>
                <span className="font-medium">{creditsUsed} / {creditsTotal}</span>
              </div>
              <Progress value={creditsPercent} className="h-2" />
              <Button variant="secondary" className="w-full" size="sm">
                Upgrade
              </Button>
            </div>
          </SidebarFooter>
        )}
      </div>
    </Sidebar>
  );
}
