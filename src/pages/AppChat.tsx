import { useState } from "react";
import { Search, Plus, Filter, Paperclip, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockThreads = [
  { id: "1", title: "New Task", date: "Today • October 1" },
  { id: "2", title: "Finding Software Engineers in SF", date: "Thursday" },
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
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <>
            {/* Header */}
            <div className="border-b border-sidebar-border px-6 py-3">
              <h2 className="font-semibold">
                {mockThreads.find((t) => t.id === selectedThread)?.title}
              </h2>
            </div>

            {/* Messages (empty state) */}
            <div className="flex-1 flex items-center justify-center p-6">
              <p className="text-muted-foreground">No messages yet</p>
            </div>

            {/* Input */}
            <div className="border-t border-sidebar-border p-4">
              <div className="max-w-3xl mx-auto">
                <div className="bg-card rounded-2xl border border-border shadow-sm">
                  <Textarea
                    placeholder="Enter message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[80px] border-0 resize-none focus-visible:ring-0"
                  />
                  <div className="flex items-center justify-between px-4 pb-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button size="icon" className="h-8 w-8 rounded-full">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Select a thread to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
