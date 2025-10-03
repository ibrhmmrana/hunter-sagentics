/**
 * List detail page - displays leads in a specific list
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getListLeads, removeFromList } from '@/data/lists';
import { ListLeadsResult } from '@/types/list';
import { Lead } from '@/types/lead';
import LeadCard from '@/components/LeadCard';
import LeadDetailsDrawer from '@/components/LeadDetailsDrawer';
import { formatRating, relativeTime } from '@/lib/utils';

export default function AppListDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [listData, setListData] = useState<ListLeadsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  
  // Lead details drawer state
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  // Load list data on mount
  useEffect(() => {
    if (id) {
      loadListData();
    }
  }, [id]);

  // Filter leads based on search query
  useEffect(() => {
    if (!listData) return;
    
    if (!searchQuery.trim()) {
      setFilteredLeads(listData.rows);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = listData.rows.filter(lead => 
      lead.title?.toLowerCase().includes(query) ||
      lead.category?.toLowerCase().includes(query) ||
      lead.city?.toLowerCase().includes(query)
    );
    setFilteredLeads(filtered);
  }, [listData, searchQuery]);

  const loadListData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getListLeads(id, 1, 100); // Load all leads for now
      setListData(data);
    } catch (err) {
      console.error('Failed to load list data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load list data');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLead = async () => {
    if (!leadToDelete || !id) return;

    try {
      await removeFromList(id, leadToDelete.place_id);
      
      // Optimistically remove from local state
      setListData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          rows: prev.rows.filter(lead => lead.place_id !== leadToDelete.place_id),
          total: prev.total - 1,
        };
      });
      
      toast.success(`Removed "${leadToDelete.title || 'lead'}" from list`);
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    } catch (err) {
      console.error('Failed to remove lead:', err);
      toast.error('Failed to remove lead from list');
    }
  };

  const openDeleteDialog = (lead: Lead) => {
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="sm" disabled>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="h-8 bg-muted rounded w-48 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="p-4">
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4">Failed to load list</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => navigate('/app/lists')}>
              Back to Lists
            </Button>
            <Button onClick={loadListData}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!listData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4">List not found</h2>
          <p className="text-muted-foreground mb-6">This list may have been deleted or you don't have access to it.</p>
          <Button onClick={() => navigate('/app/lists')}>
            Back to Lists
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-6 py-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate('/app/lists')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">List Details</h1>
              <p className="text-muted-foreground mt-1">
                {listData.total} lead{listData.total !== 1 ? 's' : ''} in this list
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          {filteredLeads.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">
                  {searchQuery ? 'No leads found' : 'This list is empty'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Go to Results → select leads → Add to List'
                  }
                </p>
                {!searchQuery && (
                  <Link to="/app/results">
                    <Button>
                      Go to Results
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredLeads.map((lead) => (
                <div key={lead.place_id} className="relative group">
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(lead)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive bg-background/80 backdrop-blur-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <LeadCard
                    lead={lead}
                    onOpen={(lead) => setActiveLead(lead)}
                  />
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove "{leadToDelete?.title || 'this lead'}" from this list? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRemoveLead}
              disabled={!leadToDelete}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lead Details Drawer */}
      <LeadDetailsDrawer
        lead={activeLead}
        open={!!activeLead}
        onOpenChange={(open) => !open && setActiveLead(null)}
      />
    </div>
  );
}
