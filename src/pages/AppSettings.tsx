import { useState } from "react";
import {
  User,
  Mic,
  Link2,
  Phone,
  Monitor,
  Bell,
  Settings as SettingsIcon,
  CreditCard,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const settingsNav = [
  { id: "general", label: "General", icon: User },
  { id: "speech", label: "Speech to Text", icon: Mic },
  { id: "connections", label: "Connections", icon: Link2 },
  { id: "phone", label: "Phone Numbers", icon: Phone },
  { id: "computers", label: "Computers", icon: Monitor },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const workspaceNav = [
  { id: "settings", label: "Settings", icon: SettingsIcon },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "members", label: "Members", icon: Users },
];

export default function AppSettings() {
  const [activeSection, setActiveSection] = useState("general");
  const [theme, setTheme] = useState("light");

  // Mock handler - no real logic
  const onThemeToggle = (mode: string) => {
    console.log("Theme toggle:", mode);
    setTheme(mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  };

  return (
    <div className="h-screen flex">
      {/* Settings Nav */}
      <div className="w-64 border-r border-sidebar-border p-4 space-y-6">
        <h2 className="font-semibold px-3">Settings</h2>

        <div className="space-y-1">
          {settingsNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground px-3">Workspace</p>
          {workspaceNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-8 space-y-8">
          {activeSection === "general" && (
            <>
              <h1 className="text-2xl font-bold">General settings</h1>

              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Profile picture</label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        I
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-x-2">
                      <Button variant="default">Upload Avatar</Button>
                      <Button variant="outline">Delete Avatar</Button>
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Full Name</label>
                    <Button variant="link" className="text-primary">
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Ibrahim Rana</p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Email address</label>
                    <Button variant="link" className="text-primary">
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">causeravagenicely@gmail.com</p>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Password</label>
                    <Button variant="link" className="text-primary">
                      Set Password
                    </Button>
                  </div>
                </div>

                {/* Theme */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <Select value={theme} onValueChange={onThemeToggle}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Delete Account */}
                <div className="pt-6">
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </>
          )}

          {activeSection !== "general" && (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                {settingsNav.find((n) => n.id === activeSection)?.label || workspaceNav.find((n) => n.id === activeSection)?.label} settings coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
