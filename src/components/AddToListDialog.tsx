/**
 * Add to List Dialog component
 * Allows users to add selected leads to existing lists or create new ones
 */

import { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { createList, listLists, addLeadsToList } from '@/data/lists';
import { ListWithCount } from '@/types/list';

interface AddToListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLeads: string[];
  onSuccess: () => void;
}

export default function AddToListDialog({
  open,
  onOpenChange,
  selectedLeads,
  onSuccess,
}: AddToListDialogProps) {
  const [lists, setLists] = useState<ListWithCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load lists when dialog opens
  useEffect(() => {
    if (open) {
      loadLists();
    }
  }, [open]);

  const loadLists = async () => {
    try {
      setLoading(true);
      const data = await listLists();
      setLists(data);
    } catch (error) {
      console.error('Failed to load lists:', error);
      toast.error('Failed to load lists');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToExistingList = async () => {
    if (!selectedListId) {
      toast.error('Please select a list');
      return;
    }

    try {
      setSubmitting(true);
      const addedCount = await addLeadsToList(selectedListId, selectedLeads);
      const listName = lists.find(l => l.id === selectedListId)?.name || 'list';
      
      toast.success(`Added ${addedCount} leads to "${listName}"`);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to add leads to list:', error);
      toast.error('Failed to add leads to list');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateNewList = async () => {
    if (!newListName.trim()) {
      toast.error('Please enter a list name');
      return;
    }

    try {
      setSubmitting(true);
      const newList = await createList(newListName.trim(), newListDescription.trim() || undefined);
      const addedCount = await addLeadsToList(newList.id, selectedLeads);
      
      toast.success(`Created "${newList.name}" and added ${addedCount} leads`);
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setNewListName('');
      setNewListDescription('');
    } catch (error) {
      console.error('Failed to create list and add leads:', error);
      toast.error('Failed to create list and add leads');
    } finally {
      setSubmitting(false);
    }
  };

  const canAddToExisting = selectedListId && !submitting;
  const canCreateNew = newListName.trim() && !submitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to List</DialogTitle>
          <DialogDescription>
            Add {selectedLeads.length} selected lead{selectedLeads.length !== 1 ? 's' : ''} to a list
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Lists</TabsTrigger>
            <TabsTrigger value="new">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : lists.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground mb-4">No lists found</p>
                <p className="text-sm text-muted-foreground">
                  Create your first list in the "Create New" tab
                </p>
              </Card>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {lists.map((list) => (
                  <Card
                    key={list.id}
                    className={`cursor-pointer transition-colors ${
                      selectedListId === list.id
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedListId(list.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{list.name}</h4>
                          {list.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {list.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {list.items_count} items
                          </Badge>
                          {selectedListId === list.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Button
              onClick={handleAddToExistingList}
              disabled={!canAddToExisting}
              className="w-full"
            >
              {submitting ? 'Adding...' : 'Add to Selected List'}
            </Button>
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="list-name">List Name</Label>
                <Input
                  id="list-name"
                  placeholder="Enter list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="list-description">Description (Optional)</Label>
                <Textarea
                  id="list-description"
                  placeholder="Enter description"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            <Button
              onClick={handleCreateNewList}
              disabled={!canCreateNew}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              {submitting ? 'Creating...' : 'Create List & Add Leads'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
