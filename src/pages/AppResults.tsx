import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  X,
  Plus,
  Download,
  Check,
  MoreHorizontal,
  Star,
  ExternalLink,
  Copy,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MOCK_LEADS, Lead } from "@/data/mockLeads";
import { LeadDetailDrawer } from "@/components/LeadDetailDrawer";
import { ListsPickerDialog, SavedList } from "@/components/ListsPickerDialog";
import { toast } from "sonner";

export default function AppResults() {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("queryId");

  // Filters
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState("none");
  const [minReviews, setMinReviews] = useState("");
  const [maxReviews, setMaxReviews] = useState("");
  const [websiteFilter, setWebsiteFilter] = useState<"any" | "yes" | "no">("any");
  const [socialsFilter, setSocialsFilter] = useState<"any" | "no">("any");
  const [openNow, setOpenNow] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Selection & UI state
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [listsDialogOpen, setListsDialogOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Mock lists (in real app, load from localStorage or Supabase)
  const [savedLists, setSavedLists] = useState<SavedList[]>([
    { id: "list-1", name: "Sandton Prospects", count: 24, lastUpdated: "2024-01-15" },
    { id: "list-2", name: "High Value Leads", count: 12, lastUpdated: "2024-01-14" },
  ]);

  // Get unique values for filters
  const allCategories = Array.from(new Set(MOCK_LEADS.map((l) => l.category)));
  const allCities = Array.from(new Set(MOCK_LEADS.map((l) => l.city)));

  // Filter leads
  const filteredLeads = useMemo(() => {
    return MOCK_LEADS.filter((lead) => {
      // Text search
      if (
        searchText &&
        !lead.title.toLowerCase().includes(searchText.toLowerCase()) &&
        !lead.category.toLowerCase().includes(searchText.toLowerCase()) &&
        !lead.city.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }

      // Category
      if (selectedCategories.length > 0 && !selectedCategories.includes(lead.category)) {
        return false;
      }

      // City
      if (selectedCities.length > 0 && !selectedCities.includes(lead.city)) {
        return false;
      }

      // Rating
      if (minRating && minRating !== "none" && (!lead.rating || lead.rating < parseFloat(minRating))) {
        return false;
      }

      // Reviews range
      if (minReviews && lead.reviewsCount < parseInt(minReviews)) {
        return false;
      }
      if (maxReviews && lead.reviewsCount > parseInt(maxReviews)) {
        return false;
      }

      // Website filter
      if (websiteFilter === "yes" && !lead.website) return false;
      if (websiteFilter === "no" && lead.website) return false;

      // Socials filter (UI-only, check if any social present)
      const hasSocials = !!(lead.facebook || lead.instagram || lead.twitter || lead.linkedin || lead.tiktok);
      if (socialsFilter === "no" && hasSocials) return false;

      // Open now
      if (openNow && !lead.openNow) return false;

      // Verified only
      if (verifiedOnly && !lead.verified) return false;

      return true;
    });
  }, [
    searchText,
    selectedCategories,
    selectedCities,
    minRating,
    minReviews,
    maxReviews,
    websiteFilter,
    socialsFilter,
    openNow,
    verifiedOnly,
  ]);

  // Paginate
  const totalPages = Math.ceil(filteredLeads.length / pageSize);
  const paginatedLeads = filteredLeads.slice((page - 1) * pageSize, page * pageSize);

  // Handlers
  const toggleSelectLead = (leadId: string) => {
    const newSet = new Set(selectedLeads);
    if (newSet.has(leadId)) {
      newSet.delete(leadId);
    } else {
      newSet.add(leadId);
    }
    setSelectedLeads(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === paginatedLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(paginatedLeads.map((l) => l.id)));
    }
  };

  const resetFilters = () => {
    setSearchText("");
    setSelectedCategories([]);
    setSelectedCities([]);
    setMinRating("none");
    setMinReviews("");
    setMaxReviews("");
    setWebsiteFilter("any");
    setSocialsFilter("any");
    setOpenNow(false);
    setVerifiedOnly(false);
  };

  const openLeadDrawer = (lead: Lead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  // Mock integration hooks (will be backed by Supabase later)
  const onFetchResults = () => {
    // TODO: fetch from Supabase tables: queries, leads
    console.log("onFetchResults", { queryId, filters: {}, pagination: { page, pageSize } });
  };

  const onAddToList = (leadIds: string[], listId: string) => {
    // TODO: insert into Supabase list_items table
    console.log("onAddToList", { leadIds, listId });
  };

  const onCreateList = (name: string) => {
    // TODO: insert into Supabase lists table
    const newList: SavedList = {
      id: `list-${Date.now()}`,
      name,
      count: selectedLeads.size,
      lastUpdated: new Date().toISOString(),
    };
    setSavedLists([...savedLists, newList]);
    console.log("onCreateList", { name });
  };

  const onExportCSV = () => {
    // TODO: generate CSV from selected leads or all filtered leads
    console.log("onExportCSV", { leadIds: Array.from(selectedLeads) });
    toast.success("Export started — we'll prepare your CSV");
  };

  const onMarkContacted = () => {
    // TODO: update activities table
    console.log("onMarkContacted", { leadIds: Array.from(selectedLeads) });
    toast.success("Marked as contacted");
    setSelectedLeads(new Set());
  };

  const onAssignOwner = () => {
    // TODO: assign owner
    console.log("onAssignOwner", { leadIds: Array.from(selectedLeads) });
    toast.success("Owner assigned");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const hasSocials = (lead: Lead) =>
    !!(lead.facebook || lead.instagram || lead.twitter || lead.linkedin || lead.tiktok);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Results</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredLeads.length} leads found. Hunter fetched these leads. Filter fast, save the best.
            </p>
          </div>
          <Button onClick={() => (window.location.href = "/app/scrape")}>
            <Plus className="mr-2 h-4 w-4" />
            New Search
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="border-b border-sidebar-border px-6 py-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          {/* Text Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Categories */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Categories
                {selectedCategories.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedCategories.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {allCategories.map((cat) => (
                <DropdownMenuItem key={cat} onClick={() => toggleCategory(cat)}>
                  <Checkbox checked={selectedCategories.includes(cat)} className="mr-2" />
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cities */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Location
                {selectedCities.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedCities.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {allCities.map((city) => (
                <DropdownMenuItem key={city} onClick={() => toggleCity(city)}>
                  <Checkbox checked={selectedCities.includes(city)} className="mr-2" />
                  {city}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Rating */}
          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Min Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Any</SelectItem>
              <SelectItem value="3.5">3.5+</SelectItem>
              <SelectItem value="4.0">4.0+</SelectItem>
              <SelectItem value="4.5">4.5+</SelectItem>
            </SelectContent>
          </Select>

          {/* Website Filter */}
          <Select value={websiteFilter} onValueChange={(v: any) => setWebsiteFilter(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Website</SelectItem>
              <SelectItem value="yes">Has Website</SelectItem>
              <SelectItem value="no">No Website</SelectItem>
            </SelectContent>
          </Select>

          {/* Socials Filter */}
          <Select value={socialsFilter} onValueChange={(v: any) => setSocialsFilter(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Socials</SelectItem>
              <SelectItem value="no">No Socials</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Toggles Row */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Switch id="open-now" checked={openNow} onCheckedChange={setOpenNow} />
            <Label htmlFor="open-now" className="text-sm">
              Open now
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="verified" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
            <Label htmlFor="verified" className="text-sm">
              Verified phone only
            </Label>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedLeads.size > 0 && (
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedLeads.size} lead{selectedLeads.size > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setListsDialogOpen(true)}>
                Add to List
              </Button>
              <Button size="sm" variant="outline" onClick={onExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button size="sm" variant="outline" onClick={onMarkContacted}>
                <Check className="mr-2 h-4 w-4" />
                Mark Contacted
              </Button>
              <Button size="sm" variant="outline" onClick={onAssignOwner}>
                Assign Owner
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedLeads(new Set())}
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 px-6 py-4">
        {filteredLeads.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              {MOCK_LEADS.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold">No results yet</h3>
                  <p className="text-muted-foreground">
                    Run a search from New Search to start finding leads.
                  </p>
                  <Button onClick={() => (window.location.href = "/app/scrape")}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Search
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">No matches</h3>
                  <p className="text-muted-foreground">Try relaxing your filters.</p>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedLeads.size === paginatedLeads.length && paginatedLeads.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Socials</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLeads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="cursor-pointer hover:bg-sidebar-accent"
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest("button, a, input")) return;
                        openLeadDrawer(lead);
                      }}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedLeads.has(lead.id)}
                          onCheckedChange={() => toggleSelectLead(lead.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${lead.latitude},${lead.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {lead.title}
                          </a>
                          <p className="text-xs text-muted-foreground">
                            {lead.category} • {lead.city}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium">{lead.rating}</span>
                            <Badge variant="secondary" className="text-xs ml-1">
                              {lead.reviewsCount}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No reviews</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {lead.phone ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(lead.phone!);
                            }}
                          >
                            {lead.phone}
                            <Copy className="ml-1 h-3 w-3" />
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {lead.website ? (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Link
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            None
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {hasSocials(lead) ? (
                          <div className="flex gap-1">
                            {lead.facebook && <Badge variant="outline" className="text-xs px-1">FB</Badge>}
                            {lead.instagram && <Badge variant="outline" className="text-xs px-1">IG</Badge>}
                            {lead.twitter && <Badge variant="outline" className="text-xs px-1">X</Badge>}
                            {lead.linkedin && <Badge variant="outline" className="text-xs px-1">LI</Badge>}
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            None
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                        {lead.address}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openLeadDrawer(lead)}>
                              Open Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedLeads(new Set([lead.id]));
                              setListsDialogOpen(true);
                            }}>
                              Add to List
                            </DropdownMenuItem>
                            <DropdownMenuItem>Export vCard</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(v) => {
                    setPageSize(parseInt(v));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredLeads.length)} of{" "}
                  {filteredLeads.length}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedLead(null);
        }}
        onAddToList={(leadId) => {
          setSelectedLeads(new Set([leadId]));
          setListsDialogOpen(true);
        }}
      />

      {/* Lists Picker Dialog */}
      <ListsPickerDialog
        open={listsDialogOpen}
        onClose={() => setListsDialogOpen(false)}
        lists={savedLists}
        selectedCount={selectedLeads.size}
        onSelectList={(listId) => onAddToList(Array.from(selectedLeads), listId)}
        onCreateList={(name) => {
          onCreateList(name);
          onAddToList(Array.from(selectedLeads), `list-${Date.now()}`);
        }}
      />
    </div>
  );
}
