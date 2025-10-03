import { Home, MessageSquare, Search, FileText, FolderOpen, Settings, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import hunterLogoLight from "@/assets/hunter-logo-light.png";
import hunterLogoDark from "@/assets/hunter-logo-dark.png";

const mainNavItems = [
  { title: "Home", url: "/app/home", icon: Home },
  { title: "Find Businesses", url: "/app/businesses", icon: Search },
  // { title: "Chat", url: "/app/chat", icon: MessageSquare }, // Hidden for now
  { title: "Results", url: "/app/results", icon: FileText },
  { title: "Lists", url: "/app/lists", icon: FolderOpen },
  { title: "Settings", url: "/app/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const creditsUsed = 310;
  const creditsTotal = 400;
  const creditsPercent = (creditsUsed / creditsTotal) * 100;
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate to login even if signOut fails
      navigate("/login", { replace: true });
    }
  };

  // Get user initials and display name
  const userInitials = user?.user_metadata?.first_name && user?.user_metadata?.last_name
    ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`
    : user?.email?.[0]?.toUpperCase() || "U";
  
  const userDisplayName = user?.user_metadata?.first_name && user?.user_metadata?.last_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
    : user?.email || "User";

  return (
    <Sidebar collapsible="icon">
      <div className="flex h-full flex-col">
        {/* Logo & Workspace Switcher */}
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3 mb-3">
            {!isCollapsed && (
              <img 
                src={hunterLogoLight} 
                alt="Hunter — by Sagentics" 
                className="h-12 dark:hidden"
              />
            )}
            {!isCollapsed && (
              <img 
                src={hunterLogoDark} 
                alt="Hunter — by Sagentics" 
                className="h-12 hidden dark:block"
              />
            )}
            {isCollapsed && (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">H</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate">{userDisplayName}</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/app/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

        {/* Footer with credits */}
        {!isCollapsed && (
          <SidebarFooter className="p-4">
            <div 
              className="space-y-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/app/settings?section=credits")}
            >
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
