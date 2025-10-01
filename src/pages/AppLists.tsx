import { useState, useEffect } from "react";
import { FolderOpen, Plus, Download, Trash2, Users, BarChart3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SavedList } from "@/components/ListsPickerDialog";
import { toast } from "sonner";

interface ListDetail extends SavedList {
  leads?: any[];
  stats?: {
    withoutWebsite: number;
    withoutSocials: number;
    avgRating: number;
    topCategories: string[];
  };
}

export default function AppLists() {
  const [lists, setLists] = useState<ListDetail[]>([]);
  const [selectedList, setSelectedList] = useState<ListDetail | null>(null);
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Load lists from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hunter_lists");
    if (saved) {
      try {
        setLists(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse lists", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("hunter_lists", JSON.stringify(lists));
  }, [lists]);

  const createList = () => {
    if (newListName.trim()) {
      const newList: ListDetail = {
        id: `list-${Date.now()}`,
        name: newListName.trim(),
        count: 0,
        lastUpdated: new Date().toISOString(),
        leads: [],
        stats: {
          withoutWebsite: 0,
          withoutSocials: 0,
          avgRating: 0,
          topCategories: [],
        },
      };
      setLists([...lists, newList]);
      setNewListName("");
      setNewListDialogOpen(false);
      toast.success(`Created list '${newList.name}'`);
    }
  };

  const deleteList = (listId: string) => {
    const list = lists.find((l) => l.id === listId);
    if (confirm(`Delete list '${list?.name}'? This cannot be undone.`)) {
      setLists(lists.filter((l) => l.id !== listId));
      setDetailDialogOpen(false);
      toast.success("List deleted");
    }
  };

  const exportList = (listId: string) => {
    // TODO: export list to CSV
    console.log("exportList", listId);
    toast.success("Export started — we'll prepare your CSV");
  };

  const openListDetail = (list: ListDetail) => {
    setSelectedList(list);
    setDetailDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Lists</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Organize and manage your saved leads
            </p>
          </div>
          <Button onClick={() => setNewListDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New List
          </Button>
        </div>
      </div>

      {/* Lists Grid */}
      <div className="flex-1 p-6">
        {lists.length === 0 ? (
          <Card className="p-12 text-center max-w-md mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No lists yet</h3>
              <p className="text-muted-foreground">
                You haven't saved any lists yet. Select leads in Results → Add to List.
              </p>
              <Button onClick={() => setNewListDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First List
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <Card
                key={list.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openListDetail(list)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{list.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(list.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{list.count} leads</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportList(list.id);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* New List Dialog */}
      <Dialog open={newListDialogOpen} onOpenChange={setNewListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
            <DialogDescription>
              Give your list a descriptive name to organize your leads.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="e.g., Sandton Restaurants"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createList();
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewListDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createList} disabled={!newListName.trim()}>
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* List Detail Dialog */}
      {selectedList && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col p-0">
            <DialogHeader className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl">{selectedList.name}</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedList.count} leads • Updated{" "}
                    {new Date(selectedList.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportList(selectedList.id)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteList(selectedList.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-auto">
              {/* Stats Row */}
              {selectedList.stats && selectedList.count > 0 && (
                <div className="px-6 py-4 bg-muted/30 border-b">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Without Website</p>
                      <p className="text-lg font-semibold">
                        {Math.round((selectedList.stats.withoutWebsite / selectedList.count) * 100)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Without Socials</p>
                      <p className="text-lg font-semibold">
                        {Math.round((selectedList.stats.withoutSocials / selectedList.count) * 100)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Avg Rating</p>
                      <p className="text-lg font-semibold">{selectedList.stats.avgRating.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Top Categories</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedList.stats.topCategories.slice(0, 2).map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Leads Table */}
              <div className="px-6 py-4">
                {selectedList.count === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No leads in this list yet. Add leads from Results.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Business</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Mock empty rows */}
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            Leads data will appear here
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
