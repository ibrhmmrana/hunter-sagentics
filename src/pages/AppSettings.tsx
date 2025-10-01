import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const settingsNav = [
  { id: "general", label: "General", icon: User },
  { id: "connections", label: "Connections", icon: Link2 },
  { id: "api-keys", label: "API Keys", icon: CreditCard },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "credits", label: "Credits", icon: CreditCard },
  { id: "members", label: "Members", icon: Users },
];

export default function AppSettings() {
  const [searchParams] = useSearchParams();
  const sectionParam = searchParams.get("section");
  const [activeSection, setActiveSection] = useState(sectionParam || "general");
  const [theme, setTheme] = useState("light");

  // Update active section when URL changes
  useEffect(() => {
    if (sectionParam) {
      setActiveSection(sectionParam);
    }
  }, [sectionParam]);

  // Mock handler - no real logic
  const onThemeToggle = (mode: string) => {
    console.log("Theme toggle:", mode);
    setTheme(mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  };

  return (
    <div className="h-screen flex">
      {/* Settings Nav */}
      <div className="w-64 border-r border-sidebar-border p-4 space-y-2">
        <h2 className="font-semibold px-3 mb-4">Settings</h2>

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

          {activeSection === "connections" && (
            <>
              <h1 className="text-2xl font-bold">Connections</h1>
              <p className="text-muted-foreground">Manage your external service integrations</p>

              <div className="space-y-6 mt-6">
                {/* n8n Card */}
                <div className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">n8n</h3>
                      <p className="text-sm text-muted-foreground">Workflow automation webhook</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs bg-muted">Not connected</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Base URL</label>
                      <Input placeholder="https://your-n8n.com" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Webhook Path</label>
                      <Input placeholder="/webhook/hunter-scrape" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Auth Header (optional)</label>
                      <Input type="password" placeholder="Bearer token..." className="mt-1" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Test Connection</Button>
                    <Button>Save</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Last tested: Never</p>
                </div>

                {/* Apify Card */}
                <div className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Apify</h3>
                      <p className="text-sm text-muted-foreground">Google Maps Scraper actor</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs bg-muted">Not connected</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Actor ID</label>
                      <Input placeholder="compass/crawler-google-places" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Dataset Name (optional)</label>
                      <Input placeholder="hunter-leads" className="mt-1" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Test Connection</Button>
                    <Button>Save</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Last tested: Never</p>
                </div>

                {/* Supabase Card */}
                <div className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Supabase</h3>
                      <p className="text-sm text-muted-foreground">Backend database & storage</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-600">Connected</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Project URL</label>
                      <Input placeholder="https://xxx.supabase.co" disabled className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Public Key</label>
                      <Input type="password" placeholder="eyJ..." disabled className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Schema</label>
                      <Input value="public" disabled className="mt-1" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Managed by Lovable Cloud</p>
                </div>

                {/* Stripe Card */}
                <div className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Stripe</h3>
                      <p className="text-sm text-muted-foreground">Billing & payments</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs bg-muted">Not connected</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Manage your subscription and payment methods</p>
                  <Button>Open Billing Portal</Button>
                </div>
              </div>
            </>
          )}

          {activeSection === "api-keys" && (
            <>
              <h1 className="text-2xl font-bold">API Keys</h1>
              <p className="text-muted-foreground">Manage your API keys for external integrations</p>
              <div className="mt-6 text-center text-muted-foreground">
                API key management coming soon
              </div>
            </>
          )}

          {activeSection === "billing" && (
            <>
              <h1 className="text-2xl font-bold">Billing</h1>
              <p className="text-muted-foreground">Manage your subscription and payment methods</p>
              <div className="mt-6 text-center text-muted-foreground">
                Billing management coming soon
              </div>
            </>
          )}

          {activeSection === "credits" && (
            <>
              <h1 className="text-2xl font-bold">Credits</h1>
              <p className="text-muted-foreground">Track your Hunter credit usage</p>
              
              <div className="mt-6 space-y-6">
                <div className="border rounded-lg p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Credits remaining</span>
                      <span className="text-2xl font-bold">310 / 400</span>
                    </div>
                    <Progress value={77.5} className="h-3" />
                  </div>
                  <Button className="w-full mt-4">Upgrade Plan</Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Usage chart and history coming soon
                </div>
              </div>
            </>
          )}

          {activeSection === "members" && (
            <>
              <h1 className="text-2xl font-bold">Members</h1>
              <p className="text-muted-foreground">Manage team access and permissions</p>
              <div className="mt-6 text-center text-muted-foreground">
                Team management coming soon
              </div>
            </>
          )}

          {activeSection !== "general" && 
           activeSection !== "connections" && 
           activeSection !== "api-keys" && 
           activeSection !== "billing" && 
           activeSection !== "credits" && 
           activeSection !== "members" && (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                {settingsNav.find((n) => n.id === activeSection)?.label} settings coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
