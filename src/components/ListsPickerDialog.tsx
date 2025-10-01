import { useState } from "react";
import { Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface SavedList {
  id: string;
  name: string;
  count: number;
  lastUpdated: string;
}

interface ListsPickerDialogProps {
  open: boolean;
  onClose: () => void;
  lists: SavedList[];
  onSelectList: (listId: string) => void;
  onCreateList: (name: string) => void;
  selectedCount?: number;
}

export function ListsPickerDialog({
  open,
  onClose,
  lists,
  onSelectList,
  onCreateList,
  selectedCount = 1,
}: ListsPickerDialogProps) {
  const [newListName, setNewListName] = useState("");
  const [showNewListInput, setShowNewListInput] = useState(false);

  const handleSelectList = (listId: string) => {
    onSelectList(listId);
    onClose();
    const list = lists.find((l) => l.id === listId);
    toast.success(`Added ${selectedCount} lead${selectedCount > 1 ? "s" : ""} to '${list?.name}'`);
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName("");
      setShowNewListInput(false);
      onClose();
      toast.success(`Created list '${newListName.trim()}' and added ${selectedCount} lead${selectedCount > 1 ? "s" : ""}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to List</DialogTitle>
          <DialogDescription>
            Select an existing list or create a new one for {selectedCount} lead{selectedCount > 1 ? "s" : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create New List */}
          {showNewListInput ? (
            <div className="space-y-2">
              <Input
                placeholder="Enter list name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateList();
                  if (e.key === "Escape") setShowNewListInput(false);
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateList} disabled={!newListName.trim()}>
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowNewListInput(false);
                    setNewListName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowNewListInput(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New List
            </Button>
          )}

          {/* Existing Lists */}
          {lists.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Recent Lists</p>
              <ScrollArea className="h-[200px]">
                <div className="space-y-1">
                  {lists.map((list) => (
                    <button
                      key={list.id}
                      onClick={() => handleSelectList(list.id)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-sidebar-accent transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{list.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Updated {new Date(list.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {list.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {lists.length === 0 && !showNewListInput && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No lists yet. Create your first list above.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
