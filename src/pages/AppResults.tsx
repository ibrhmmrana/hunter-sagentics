/**
 * AppResults page - displays leads in table and card views
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search as SearchIcon, 
  Star,
  Phone, 
  Globe, 
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Table as TableIcon,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Music,
  Pin,
  MessageSquare,
  Check,
  X
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { listLeads, ListLeadsResult, updateLeadContacted } from '@/data/leads';
import { Lead } from '@/types/lead';
import { formatRating, getHostname, isMaps } from '@/lib/utils';
import TimeAgo from '@/components/TimeAgo';
import LeadCard from '@/components/LeadCard';
import LeadImagePreview from '@/components/LeadImagePreview';
import LeadLogo from '@/components/LeadLogo';
import LeadDetailsDrawer from '@/components/LeadDetailsDrawer';
import ContactPreview from '@/components/ContactPreview';
import ContactsSheet from '@/components/ContactsSheet';
import LeadContactsPanel from '@/components/LeadContactsPanel';
import AddToListDialog from '@/components/AddToListDialog';
import ResultsFilters from '@/components/ResultsFilters';
import { toast } from 'sonner';
import { useLeadsRealtime } from '@/hooks/useLeadsRealtime';

export default function AppResults() {
  const [searchParams] = useSearchParams();
  
  // Parse URL parameters
  const q = searchParams.get("q") || undefined;
  const sort = (searchParams.get("sort") as "recent" | "rating_desc" | "rating_asc" | "reviews_desc") || "recent";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const website = (searchParams.get("website") as "any" | "none" | "has") || "any";
  const socials = (searchParams.get("socials") as "any" | "none" | "has") || "any";
  const contacted = (searchParams.get("contacted") as "any" | "no" | "yes") || "any";
  // Force cards view - table view is hidden for now
  const view: "cards" | "table" = "cards";

  // State
  const [results, setResults] = useState<ListLeadsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [contactsSheetOpen, setContactsSheetOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>("");
  const [selectedBusinessTitle, setSelectedBusinessTitle] = useState<string>("");
  const [contactsPanelOpen, setContactsPanelOpen] = useState(false);
  const [contactsPanelPlaceId, setContactsPanelPlaceId] = useState<string>("");
  const [contactsPanelTitle, setContactsPanelTitle] = useState<string>("");

  // Selection state
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [addToListDialogOpen, setAddToListDialogOpen] = useState(false);

  // Helper function to open contacts panel
  const handleViewContacts = (placeId: string, title: string) => {
    setContactsPanelPlaceId(placeId);
    setContactsPanelTitle(title);
    setContactsPanelOpen(true);
  };

  // Selection handlers
  const toggleLeadSelection = (placeId: string) => {
    setSelectedLeads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(placeId)) {
        newSet.delete(placeId);
    } else {
        newSet.add(placeId);
      }
      return newSet;
    });
  };

  const selectAllLeads = () => {
    if (!results) return;
    setSelectedLeads(new Set(results.rows.map(lead => lead.place_id)));
  };

  const clearSelection = () => {
    setSelectedLeads(new Set());
  };

  const handleAddToListSuccess = () => {
    clearSelection();
    // Optionally refetch to show updated data
    refetchLeads();
  };

  // Handle contacted status toggle
  const handleToggleContacted = async (placeId: string, contacted: boolean) => {
    try {
      await updateLeadContacted(placeId, contacted);
      
      // Optimistically update local state
      setResults(prev => {
        if (!prev) return null;
        return {
          ...prev,
          rows: prev.rows.map(lead => 
            lead.place_id === placeId 
              ? { ...lead, contacted } 
              : lead
          )
        };
      });
      
      toast.success(contacted ? 'Marked as contacted' : 'Marked as not contacted');
    } catch (error) {
      console.error('Failed to update contacted status:', error);
      toast.error('Failed to update contacted status');
    }
  };

  // Handle bulk mark as contacted
  const handleBulkMarkContacted = async () => {
    try {
      const placeIds = Array.from(selectedLeads);
      
      // Update all selected leads
      await Promise.all(
        placeIds.map(placeId => updateLeadContacted(placeId, true))
      );
      
      // Optimistically update local state
      setResults(prev => {
        if (!prev) return null;
        return {
          ...prev,
          rows: prev.rows.map(lead => 
            selectedLeads.has(lead.place_id) 
              ? { ...lead, contacted: true } 
              : lead
          )
        };
      });
      
      toast.success(`${placeIds.length} lead${placeIds.length !== 1 ? 's' : ''} marked as contacted`);
      clearSelection();
    } catch (error) {
      console.error('Failed to bulk mark as contacted:', error);
      toast.error('Failed to mark leads as contacted');
    }
  };

  // Refetch function for realtime updates
  const refetchLeads = useCallback(async () => {
    try {
      const data = await listLeads({ q, sort, page, pageSize, website, socials, contacted });
      setResults(data);
    } catch (err) {
      console.error("Error refetching leads:", err);
    }
  }, [q, sort, page, pageSize, website, socials, contacted]);

  // Fetch leads data
  useEffect(() => {
    async function fetchLeads() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await listLeads({ q, sort, page, pageSize, website, socials, contacted });
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load leads");
        console.error("Error fetching leads:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeads();
  }, [q, sort, page, pageSize, website, socials, contacted]);

  // Realtime subscription for leads updates
  useLeadsRealtime({
    onChange: useCallback((change) => {
      console.log('Realtime lead change received:', change);

      // For INSERT and DELETE, refetch to get accurate data
      // For UPDATE, skip refetch to preserve order (we handle updates optimistically)
      if (change.type === 'INSERT' || change.type === 'DELETE') {
        refetchLeads();
      }

      // Show toast notification for new leads
      if (change.type === 'INSERT') {
        toast.success('New lead arrived!', {
          description: `Added: ${change.row.title || 'Untitled'}`,
          duration: 3000,
        });
      } else if (change.type === 'UPDATE') {
        // For updates, just update local state without refetching to preserve order
        setResults(prev => {
          if (!prev) return null;
          return {
            ...prev,
            rows: prev.rows.map(lead => 
              lead.place_id === change.row.place_id 
                ? { ...lead, ...change.row } 
                : lead
            )
          };
        });
      } else if (change.type === 'DELETE') {
        toast.warning('Lead removed', {
          description: `Removed: ${change.row.title || 'Untitled'}`,
          duration: 2000,
        });
      }
    }, [refetchLeads]),
    enabled: true, // Always enabled when component is mounted
  });

  // Clamp page to valid range when results change
  const safePage = results ? Math.min(Math.max(1, page), results.pageCount) : 1;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Results</h1>
              <p className="text-sm text-muted-foreground mt-1">Loading leads...</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-9 bg-muted rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 px-6 py-4">
          {view === 'cards' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="shadow-sm border rounded-xl overflow-hidden">
                  <div className="p-0">
                    <div className="aspect-video bg-muted animate-pulse"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 bg-muted rounded animate-pulse w-1/4"></div>
                        <div className="h-3 bg-muted rounded animate-pulse w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border bg-background shadow-sm">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
                  <TableRow>
                    <TableHead scope="col" className="w-20 px-4 py-3">Logo</TableHead>
                    <TableHead scope="col" className="px-4 py-3">Title</TableHead>
                    <TableHead scope="col" className="px-4 py-3">Category</TableHead>
                    <TableHead scope="col" className="px-4 py-3 hidden md:table-cell">City</TableHead>
                    <TableHead scope="col" className="px-4 py-3">Phone</TableHead>
                    <TableHead scope="col" className="px-2 py-3 text-center">Rating</TableHead>
                    <TableHead scope="col" className="px-2 py-3 text-center hidden md:table-cell">Reviews</TableHead>
                    <TableHead scope="col" className="px-4 py-3 hidden sm:table-cell">Website</TableHead>
                    <TableHead scope="col" className="px-4 py-3 hidden sm:table-cell">Socials</TableHead>
                    <TableHead scope="col" className="px-4 py-3 hidden md:table-cell">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i} className={`h-14 ${i % 2 === 1 ? "odd:bg-muted/20" : ""}`}>
                      <TableCell className="px-4 py-3 rounded-l-lg">
                        <div className="w-14 h-14 bg-muted rounded-lg animate-pulse" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="h-4 bg-muted rounded animate-pulse w-32" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="h-4 bg-muted rounded animate-pulse w-20" />
                      </TableCell>
                      <TableCell className="px-4 py-3 hidden md:table-cell">
                        <div className="h-4 bg-muted rounded animate-pulse w-16" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="h-4 bg-muted rounded animate-pulse w-24" />
                      </TableCell>
                      <TableCell className="px-2 py-3 text-center">
                        <div className="h-4 bg-muted rounded animate-pulse w-10 mx-auto" />
                      </TableCell>
                      <TableCell className="px-2 py-3 text-center hidden md:table-cell">
                        <div className="h-4 bg-muted rounded animate-pulse w-12 mx-auto" />
                      </TableCell>
                      <TableCell className="px-4 py-3 hidden sm:table-cell">
                        <div className="h-4 bg-muted rounded animate-pulse w-24" />
                      </TableCell>
                      <TableCell className="px-4 py-3 hidden sm:table-cell">
                        <div className="h-4 bg-muted rounded animate-pulse w-16" />
                      </TableCell>
                      <TableCell className="px-4 py-3 hidden md:table-cell rounded-r-lg">
                        <div className="h-4 bg-muted rounded animate-pulse w-20" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="border-b border-border px-6 py-4">
          <h1 className="text-2xl font-bold">Results</h1>
          <p className="text-sm text-muted-foreground mt-1">Error loading leads</p>
        </div>
        <div className="flex-1 px-6 py-4">
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
                <SearchIcon className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-destructive">Error</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()}>
                <Plus className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No data available</h2>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Results</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Found {results.total.toLocaleString()} leads. Filter and explore your prospects.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle - Hidden for now, keeping code for future use */}
            {/* <div className="flex items-center border rounded-lg p-1">
              <Link
                to={`/app/results?${new URLSearchParams({ ...Object.fromEntries(searchParams), view: 'table', page: '1' }).toString()}`}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  view === 'table'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <TableIcon className="mr-2 h-4 w-4" />
                Table
              </Link>
              <Link
                to={`/app/results?${new URLSearchParams({ ...Object.fromEntries(searchParams), view: 'cards', page: '1' }).toString()}`}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  view === 'cards'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Cards
              </Link>
            </div> */}
            <Link to="/app/businesses">
              <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Search
          </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ResultsFilters totalResults={results.total} />

      {/* Content */}
      <div className="flex-1 px-6 py-4">
        {results.rows.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <SearchIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No leads found</h3>
                  <p className="text-muted-foreground">
                {q ? "Try adjusting your search terms or" : "Run a search to start finding leads."}
                  </p>
              <Link to="/app/businesses">
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Search
                  </Button>
              </Link>
            </div>
          </Card>
        ) : view === 'cards' ? (
          <div className="space-y-4">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
              {results.rows.map((lead) => (
                <div key={lead.place_id} className="relative group">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedLeads.has(lead.place_id)}
                      onCheckedChange={() => toggleLeadSelection(lead.place_id)}
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>
                  <LeadCard
                    lead={lead}
                    onOpen={(lead) => setActiveLead(lead)}
                    onViewContacts={handleViewContacts}
                    onToggleContacted={handleToggleContacted}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((safePage - 1) * results.pageSize) + 1}-{Math.min(safePage * results.pageSize, results.total)} of {results.total.toLocaleString()}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/app/results?${new URLSearchParams({
                    ...Object.fromEntries(new URLSearchParams(window.location.search)),
                    page: Math.max(1, safePage - 1).toString()
                  }).toString()}`}
                  className={safePage <= 1 ? "pointer-events-none" : ""}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                  </Button>
                </Link>

                <span className="text-sm text-muted-foreground px-2">
                  Page {safePage} of {results.pageCount}
                </span>

                <Link
                  to={`/app/results?${new URLSearchParams({
                    ...Object.fromEntries(new URLSearchParams(window.location.search)),
                    page: Math.min(results.pageCount, safePage + 1).toString()
                  }).toString()}`}
                  className={safePage >= results.pageCount ? "pointer-events-none" : ""}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage >= results.pageCount}
                    aria-label="Next page"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : view === 'table' ? (
          <div className="space-y-4">
            {/* Results Table */}
            <div className="rounded-2xl border bg-background shadow-sm">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
                  <TableRow>
                    <TableHead scope="col" className="w-12 px-4 py-3">
                      <Checkbox
                        checked={results.rows.length > 0 && selectedLeads.size === results.rows.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            selectAllLeads();
                          } else {
                            clearSelection();
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead scope="col" className="w-20 px-4 py-3">Logo</TableHead>
                    <TableHead scope="col" className="px-4 py-3">Title</TableHead>
                    <TableHead scope="col" className="px-4 py-3">Category</TableHead>
                    <TableHead scope="col" className="px-4 py-3 hidden md:table-cell">City</TableHead>
                    <TableHead scope="col" className="px-4 py-3">Phone</TableHead>
                    <TableHead scope="col" className="px-2 py-3 text-center">Rating</TableHead>
                    <TableHead scope="col" className="px-2 py-3 text-center hidden md:table-cell">Reviews</TableHead>
                    <TableHead scope="col" className="px-4 py-3 hidden lg:table-cell">
                      People
                      <Badge variant="secondary" className="ml-2 text-xs">New</Badge>
                    </TableHead>
                    <TableHead scope="col" className="px-4 py-3 hidden sm:table-cell">Website</TableHead>
                    <TableHead scope="col" className="px-4 py-3 hidden sm:table-cell">Socials</TableHead>
                    <TableHead scope="col" className="px-4 py-3 hidden md:table-cell">Created</TableHead>
                    <TableHead scope="col" className="px-4 py-3 hidden lg:table-cell">Contacted</TableHead>
                    <TableHead scope="col" className="px-4 py-3 sm:hidden">Links</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.rows.map((lead, index) => {
                    const socialIcons = [
                      { key: 'facebook', url: lead.facebook, Icon: Facebook },
                      { key: 'instagram', url: lead.instagram, Icon: Instagram },
                      { key: 'linkedin', url: lead.linkedin, Icon: Linkedin },
                      { key: 'twitter', url: lead.twitter, Icon: Twitter },
                      { key: 'youtube', url: lead.youtube, Icon: Youtube },
                      { key: 'tiktok', url: lead.tiktok, Icon: Music },
                      { key: 'pinterest', url: lead.pinterest, Icon: Pin },
                      { key: 'discord', url: lead.discord, Icon: MessageSquare },
                    ].filter(social => social.url);

                    const website = lead.website ?? null;
                    const isRealWebsite = !!website && !isMaps(website);

                    return (
                    <TableRow
                        key={lead.place_id}
                        className={`group h-14 transition-colors hover:bg-muted/30 ${index % 2 === 1 ? "odd:bg-muted/20" : ""}`}
                      >
                        <TableCell className="px-4 py-3">
                        <Checkbox
                            checked={selectedLeads.has(lead.place_id)}
                            onCheckedChange={() => toggleLeadSelection(lead.place_id)}
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3 rounded-l-lg">
                          <LeadImagePreview
                            src={lead.image_url}
                            title={lead.title}
                            mapsUrl={lead.url}
                            trigger={
                              <div className="group-hover:shadow-md transition-shadow">
                                <LeadLogo
                                  title={lead.title}
                                  imageUrl={lead.image_url}
                                  size={56}
                                  rounded="lg"
                                />
                              </div>
                            }
                        />
                      </TableCell>
                        <TableCell className="px-4 py-3">
                          <span className="font-bold">{lead.title || "Untitled"}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <span className="text-sm">{lead.category || "—"}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3 hidden md:table-cell">
                          <span className="text-sm">{lead.city || "—"}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {lead.phone ? (
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                              aria-label={`Call ${lead.phone}`}
                            >
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                      </TableCell>
                        <TableCell className="px-2 py-3 text-center">
                        {lead.rating ? (
                            <Badge variant="secondary" className="flex items-center gap-1 w-fit mx-auto">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-medium">{formatRating(lead.rating)}</span>
                            </Badge>
                        ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                        <TableCell className="px-2 py-3 text-center hidden md:table-cell">
                          <span className="text-sm">
                            {lead.review_count ? lead.review_count.toLocaleString() : "—"}
                          </span>
                      </TableCell>
                        <TableCell className="px-4 py-3 hidden lg:table-cell">
                          <ContactPreview placeId={lead.place_id} onViewContacts={() => handleViewContacts(lead.place_id, lead.title)} />
                      </TableCell>
                        <TableCell className="px-4 py-3 hidden sm:table-cell">
                          {isRealWebsite ? (
                          <a
                              href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm flex items-center gap-1"
                              aria-label={`Visit website for ${lead.title}`}
                          >
                              <Globe className="h-3 w-3" />
                              {getHostname(website)}
                          </a>
                        ) : (
                            <Badge variant="outline" className="text-xs text-muted-foreground">No website</Badge>
                        )}
                      </TableCell>
                        <TableCell className="px-4 py-3 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            {socialIcons.length > 0 ? (
                              socialIcons.map(({ key, url, Icon }) => (
                                <a
                                  key={key}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                  aria-label={`Visit ${key} profile`}
                                >
                                  <Icon className="h-3 w-3" />
                                </a>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </div>
                      </TableCell>
                        <TableCell className="px-4 py-3 hidden md:table-cell">
                          <TimeAgo 
                            iso={lead.created_at} 
                            titlePrefix="Created" 
                            className="text-sm text-muted-foreground" 
                          />
                      </TableCell>
                        <TableCell className="px-4 py-3 hidden lg:table-cell">
                          <Button
                            variant={lead.contacted ? "default" : "outline"}
                            size="sm"
                            className={`text-xs h-7 px-2 ${
                              lead.contacted 
                                ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
                                : "hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                            }`}
                            onClick={() => handleToggleContacted(lead.place_id, !lead.contacted)}
                          >
                            <Check className="h-3 w-3" />
                            {lead.contacted ? '' : 'Mark'}
                            </Button>
                      </TableCell>
                        <TableCell className="px-4 py-3 sm:hidden rounded-r-lg">
                          <div className="flex items-center gap-2">
                            {isRealWebsite && (
                              <a
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label={`Visit website for ${lead.title}`}
                              >
                                <Globe className="h-3 w-3" />
                              </a>
                            )}
                            {socialIcons.map(({ key, url, Icon }) => (
                              <a
                                key={key}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label={`Visit ${key} profile`}
                              >
                                <Icon className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((safePage - 1) * results.pageSize) + 1}-{Math.min(safePage * results.pageSize, results.total)} of {results.total.toLocaleString()}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/app/results?${new URLSearchParams({
                    ...Object.fromEntries(new URLSearchParams(window.location.search)),
                    page: Math.max(1, safePage - 1).toString()
                  }).toString()}`}
                  className={safePage <= 1 ? "pointer-events-none" : ""}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                  </Button>
                </Link>

                <span className="text-sm text-muted-foreground px-2">
                  Page {safePage} of {results.pageCount}
                </span>

                <Link
                  to={`/app/results?${new URLSearchParams({
                    ...Object.fromEntries(new URLSearchParams(window.location.search)),
                    page: Math.min(results.pageCount, safePage + 1).toString()
                  }).toString()}`}
                  className={safePage >= results.pageCount ? "pointer-events-none" : ""}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage >= results.pageCount}
                    aria-label="Next page"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
                </div>
              </div>
            </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Invalid view selected</p>
          </div>
        )}
      </div>

      {/* Lead Details Drawer */}
      {activeLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <LeadLogo
                  title={activeLead.title}
                  imageUrl={activeLead.image_url}
                  size={80}
                  rounded="lg"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{activeLead.title || 'Untitled'}</h2>
                  <p className="text-muted-foreground">{activeLead.category || '—'}</p>
                  {activeLead.city && (
                    <p className="text-sm text-muted-foreground">{activeLead.city}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveLead(null)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                {activeLead.rating && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{formatRating(activeLead.rating)}</span>
                    </Badge>
                    {activeLead.review_count && (
                      <span className="text-sm text-muted-foreground">
                        {activeLead.review_count.toLocaleString()} reviews
                      </span>
                    )}
                  </div>
                )}
                
                {activeLead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${activeLead.phone}`} className="text-primary hover:underline">
                      {activeLead.phone}
                    </a>
                  </div>
                )}
                
                {activeLead.website && !isMaps(activeLead.website) && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={activeLead.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {getHostname(activeLead.website)}
                    </a>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                  <TimeAgo iso={activeLead.created_at} titlePrefix="Added" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Lead Details Drawer */}
      <LeadDetailsDrawer
        lead={activeLead}
        open={!!activeLead}
        onOpenChange={(v) => !v && setActiveLead(null)}
        onViewContacts={handleViewContacts}
      />

      {/* Contacts Sheet (for table view) */}
      <ContactsSheet
        placeId={selectedPlaceId}
        open={contactsSheetOpen}
        onOpenChange={setContactsSheetOpen}
        title={selectedBusinessTitle}
      />

      {/* Lead Contacts Panel */}
      <LeadContactsPanel
        placeId={contactsPanelPlaceId}
        title={contactsPanelTitle}
        open={contactsPanelOpen}
        onClose={() => setContactsPanelOpen(false)}
      />

      {/* Selection Footer */}
      {selectedLeads.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
          <div className="px-4 py-3">
            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">
                  {selectedLeads.size} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="text-muted-foreground hover:text-foreground h-8 px-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleBulkMarkContacted}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-green-200 text-green-800 hover:bg-green-50 h-9"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Contacted
                </Button>
                <Button
                  onClick={() => setAddToListDialogOpen(true)}
                  size="sm"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-9"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add to List
                </Button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {selectedLeads.size} lead{selectedLeads.size !== 1 ? 's' : ''} selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleBulkMarkContacted}
                    variant="outline"
                    className="border-green-200 text-green-800 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Contacted
                  </Button>
                  <Button
                    onClick={() => setAddToListDialogOpen(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to List
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to List Dialog */}
      <AddToListDialog
        open={addToListDialogOpen}
        onOpenChange={setAddToListDialogOpen}
        selectedLeads={Array.from(selectedLeads)}
        onSuccess={handleAddToListSuccess}
      />
    </div>
  );
}