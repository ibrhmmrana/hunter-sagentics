import { useState } from "react";
import { Search, Plus, Filter, Paperclip, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockThreads = [
  { id: "1", title: "Sandton: Restaurants — No Website", date: "Today" },
  { id: "2", title: "Rosebank: Gyms — Missing Socials", date: "Yesterday" },
  { id: "3", title: "Export list for Cape Town dentists", date: "Oct 29" },
  { id: "4", title: "Draft outreach for 'Urban Coffee'", date: "Oct 28" },
];

const quickPrompts = [
  "Find restaurants in Sandton without websites",
  "Show top 20 leads with no social profiles",
  "Summarize ratings distribution by city",
  "Draft an outreach email for 'Golden Bakery'",
  "Create list: Rosebank • Gyms • No Website",
  "Export CSV for my current filters",
];

export default function AppChat() {
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Mock handler - no real logic
  const onOpenThread = (threadId: string) => {
    console.log("Open thread:", threadId);
    setSelectedThread(threadId);
  };

  return (
    <div className="h-screen flex">
      {/* Threads List */}
      <div className="w-80 border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-9" />
            </div>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="mb-2 px-3 py-1">
              <span className="text-xs font-medium text-muted-foreground">Today • October 1</span>
            </div>
            {mockThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => onOpenThread(thread.id)}
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors ${
                  selectedThread === thread.id ? "bg-sidebar-accent" : ""
                }`}
              >
                <p className="font-medium text-sm">{thread.title}</p>
                {thread.date !== "Today • October 1" && (
                  <p className="text-xs text-muted-foreground mt-0.5">{thread.date}</p>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Conversation Pane */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-yellow-50/30">
        {selectedThread ? (
          <>
            {/* Header */}
            <div className="border-b border-border/50 px-6 py-4 bg-background/80 backdrop-blur-sm">
              <h2 className="font-semibold text-lg">
                {mockThreads.find((t) => t.id === selectedThread)?.title}
              </h2>
            </div>

            {/* Messages (empty state) */}
            <div className="flex-1 flex items-center justify-center p-6">
              <p className="text-muted-foreground">No messages yet</p>
            </div>

            {/* Input */}
            <div className="border-t border-border/50 p-6 bg-background/50 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
                <div className="bg-background rounded-3xl border border-border/50 shadow-lg">
                  <Textarea
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] border-0 resize-none focus-visible:ring-0 text-base px-5 pt-4"
                  />
                  <div className="flex items-center justify-between px-5 pb-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted">
                        <Mic className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button size="icon" className="h-10 w-10 rounded-full shadow-md">
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
            <div className="w-full space-y-8">
              {/* Heading */}
              <h1 className="text-4xl font-semibold text-center text-foreground mb-4">
                How can I help?
              </h1>

              {/* Input Box */}
              <div className="bg-background rounded-3xl border border-border/50 shadow-xl">
                <Textarea
                  placeholder="Ask Hunter to analyze results, draft outreach, or create lists…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[140px] border-0 resize-none focus-visible:ring-0 text-base px-6 pt-5"
                />
                <div className="flex items-center justify-between px-6 pb-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted">
                      <Mic className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button size="icon" className="h-10 w-10 rounded-full shadow-md">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setMessage(prompt)}
                      className="px-4 py-2.5 rounded-full bg-background border border-border/60 hover:bg-muted hover:border-border text-sm transition-all shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
