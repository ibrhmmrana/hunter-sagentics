/**
 * Mobile-only sticky header with logo and hamburger menu
 */

import { Menu, X, Home, Search, FileText, FolderOpen, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  { title: "Results", url: "/app/results", icon: FileText },
  { title: "Lists", url: "/app/lists", icon: FolderOpen },
  { title: "Settings", url: "/app/settings", icon: Settings },
];

export function MobileHeader() {
  const { openMobile, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Only render on mobile
  if (!isMobile) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
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
    <div className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
      {/* Logo */}
      <div className="flex items-center">
        <img 
          src={hunterLogoLight} 
          alt="Hunter — by Sagentics" 
          className="h-8 dark:hidden"
        />
        <img 
          src={hunterLogoDark} 
          alt="Hunter — by Sagentics" 
          className="h-8 hidden dark:block"
        />
      </div>

      {/* User Account Dropdown */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {userDisplayName}
            </DropdownMenuLabel>
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

        {/* Hamburger Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setOpenMobile(!openMobile)}
          aria-label="Toggle navigation menu"
        >
          {openMobile ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
