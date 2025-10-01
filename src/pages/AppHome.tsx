import { useState } from "react";
import { Mic, Paperclip, ArrowUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const suggestedChips = [
  "Personal website",
  "Customer Support Email",
  "Outbound Sales Calls",
  "Lead gen",
  "Meeting Recorder",
  "LinkedIn outreach",
  "Support Chatbot",
];

const categories = [
  "Engineering",
  "Meetings",
  "Most popular",
  "Productivity",
  "Sales",
];

export default function AppHome() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock handler - no real logic
  const onStartNewSearch = () => {
    console.log("Start new search:", searchQuery);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-sidebar-border px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Home</h1>
        <Button size="sm">
          <ArrowUp className="mr-2 h-4 w-4" />
          New Search
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-warm">
        <div className="container max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* Prompt Card */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-center">How can I help?</h2>
            
            <div className="bg-card rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Build an agent or perform a task"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  onKeyDown={(e) => e.key === "Enter" && onStartNewSearch()}
                />
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={onStartNewSearch}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Build apps chip */}
              <div className="mt-4">
                <Badge variant="secondary" className="gap-1">
                  <span className="text-xs">🔧</span>
                  <span>Build apps</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Suggested Chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedChips.map((chip, i) => (
              <Badge
                key={i}
                variant={chip === "Lead gen" ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {chip}
              </Badge>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={cat === "Engineering" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
            <Button variant="ghost" size="sm" className="rounded-full">
              See all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {/* Engineering Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Engineering</h3>
              <Button variant="ghost" size="sm">
                See all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
