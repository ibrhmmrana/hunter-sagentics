import { useState, useEffect } from "react";
import { ArrowUp, Copy, RefreshCw, X, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";

// South African cities and suburbs for location suggestions
const SA_LOCATIONS = [
  "Johannesburg", "Sandton", "Rosebank", "Cape Town", "Durban",
  "Pretoria", "Port Elizabeth", "Bloemfontein", "East London",
  "Pietermaritzburg", "Benoni", "Tembisa", "Vereeniging", "Centurion",
  "Roodepoort", "Soweto", "Midrand", "Randburg", "Boksburg", "Springs"
];

// Common business categories
const COMMON_CATEGORIES = [
  "Restaurant", "Salon", "Dentist", "Gym", "Coffee", 
  "Auto repair", "Bakery", "Spa", "Clinic", "Pharmacy"
];

interface SearchPayload {
  includeWebResults: boolean;
  language: string;
  locationQuery: string;
  maxCrawledPlacesPerSearch: number;
  maxImages: number;
  maximumLeadsEnrichmentRecords: number;
  scrapeContacts: boolean;
  scrapeDirectories: boolean;
  scrapeImageAuthors: boolean;
  scrapePlaceDetailPage: boolean;
  scrapeReviewsPersonalData: boolean;
  scrapeTableReservationProvider: boolean;
  searchStringsArray: string[];
  skipClosedPlaces: boolean;
  website: string;
  searchMatching: string;
  placeMinimumStars: string;
  maxQuestions: number;
  maxReviews: number;
  reviewsSort: string;
  reviewsFilterString: string;
  reviewsOrigin: string;
  allPlacesNoSearchAction: string;
}

interface JobStatus {
  id: string;
  status: "queued" | "running" | "completed" | "failed";
  startedAt: string;
}

export default function AppScrape() {
  // Form state
  const [locationQuery, setLocationQuery] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [searchStringsArray, setSearchStringsArray] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [maxCrawledPlacesPerSearch, setMaxCrawledPlacesPerSearch] = useState([200]);
  const [skipClosedPlaces, setSkipClosedPlaces] = useState(true);
  const [website, setWebsite] = useState("withoutWebsite");
  const [withoutSocials, setWithoutSocials] = useState(false);
  const [placeMinimumStars, setPlaceMinimumStars] = useState("");
  const [reviewsSort, setReviewsSort] = useState("newest");
  const [reviewsOrigin, setReviewsOrigin] = useState("all");
  const [scrapeContacts, setScrapeContacts] = useState(true);
  const [includeWebResults, setIncludeWebResults] = useState(false);
  const [scrapeReviewsPersonalData, setScrapeReviewsPersonalData] = useState(false);
  const [maximumLeadsEnrichmentRecords, setMaximumLeadsEnrichmentRecords] = useState(0);
  const [maxReviews, setMaxReviews] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced toggles
  const [scrapeDirectories, setScrapeDirectories] = useState(false);
  const [scrapeImageAuthors, setScrapeImageAuthors] = useState(false);
  const [scrapePlaceDetailPage, setScrapePlaceDetailPage] = useState(false);
  const [scrapeTableReservationProvider, setScrapeTableReservationProvider] = useState(false);

  // Job state
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);

  // Validation
  const isValid = locationQuery.trim() !== "" && searchStringsArray.length > 0;

  // Build payload
  const payload: SearchPayload = {
    includeWebResults,
    language: "en",
    locationQuery,
    maxCrawledPlacesPerSearch: maxCrawledPlacesPerSearch[0],
    maxImages: 0,
    maximumLeadsEnrichmentRecords,
    scrapeContacts,
    scrapeDirectories,
    scrapeImageAuthors,
    scrapePlaceDetailPage,
    scrapeReviewsPersonalData,
    scrapeTableReservationProvider,
    searchStringsArray,
    skipClosedPlaces,
    website,
    searchMatching: "all",
    placeMinimumStars,
    maxQuestions,
    maxReviews,
    reviewsSort,
    reviewsFilterString: "",
    reviewsOrigin,
    allPlacesNoSearchAction: "",
  };

  const payloadString = JSON.stringify(payload, null, 2);
  const payloadSize = new Blob([payloadString]).size;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("hunter_search_form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLocationQuery(parsed.locationQuery || "");
        setSearchStringsArray(parsed.searchStringsArray || []);
        setMaxCrawledPlacesPerSearch([parsed.maxCrawledPlacesPerSearch || 200]);
        setWebsite(parsed.website || "withoutWebsite");
        setPlaceMinimumStars(parsed.placeMinimumStars || "");
      } catch (e) {
        console.error("Failed to parse saved form", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("hunter_search_form", JSON.stringify(payload));
  }, [payloadString]);

  // Mock handlers - no real logic, just UI integration hooks
  const onRunSearch = () => {
    // TODO: POST to n8n webhook endpoint with:
    // - payload (Apify JSON)
    // - uiFlags: { withoutSocials }
    // Expected response: { jobId: string, status: string }
    console.log("onRunSearch called with payload:", payload);
    console.log("UI flags:", { withoutSocials });

    const mockJobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setJobStatus({
      id: mockJobId,
      status: "running",
      startedAt: new Date().toISOString(),
    });

    toast.success("Search started!", {
      description: `Job ID: ${mockJobId}`,
    });
  };

  const onRefreshJob = (jobId: string) => {
    // TODO: Poll n8n/Apify for job status
    console.log("onRefreshJob called for:", jobId);
    toast.info("Job status refreshed");
  };

  const onCancelJob = (jobId: string) => {
    // TODO: Send cancel request to n8n
    console.log("onCancelJob called for:", jobId);
    setJobStatus(null);
    toast.info("Job cancelled");
  };

  const onSavePreset = () => {
    // TODO: Save preset to Supabase or localStorage
    console.log("onSavePreset called with:", payload);
    toast.success("Preset saved!");
  };

  const onViewResults = (jobId: string) => {
    // TODO: Navigate to /app/results?queryId={jobId}
    console.log("onViewResults called for:", jobId);
    window.location.href = `/app/results?queryId=${jobId}`;
  };

  // Preset helpers
  const applyPreset = (preset: string) => {
    switch (preset) {
      case "no-website":
        setWebsite("withoutWebsite");
        setWithoutSocials(false);
        toast.success("Preset applied: No Website");
        break;
      case "no-socials":
        setWithoutSocials(true);
        toast.success("Preset applied: No Socials");
        break;
      case "high-rating":
        setPlaceMinimumStars("4.5");
        toast.success("Preset applied: High Rating (≥4.5)");
        break;
      case "restaurants":
        setSearchStringsArray(["Restaurant"]);
        toast.success("Preset applied: Restaurants");
        break;
      case "salons":
        setSearchStringsArray(["Salon"]);
        toast.success("Preset applied: Salons");
        break;
      case "dentists":
        setSearchStringsArray(["Dentist"]);
        toast.success("Preset applied: Dentists");
        break;
    }
  };

  const addCategory = (category: string) => {
    if (category && !searchStringsArray.includes(category)) {
      setSearchStringsArray([...searchStringsArray, category]);
      setNewCategory("");
    }
  };

  const removeCategory = (category: string) => {
    setSearchStringsArray(searchStringsArray.filter((c) => c !== category));
  };

  const filteredLocations = SA_LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(locationQuery.toLowerCase())
  );

  const copyPayload = () => {
    navigator.clipboard.writeText(payloadString);
    toast.success("Payload copied to clipboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-sidebar-border px-6 py-4">
        <h1 className="text-2xl font-bold">New Search</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tell Hunter what to find. We'll hunt for businesses with missing web presence so you can pitch them.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid lg:grid-cols-2 gap-6 p-6">
        {/* Left: Form */}
        <div className="space-y-6">
          <Card className="p-6 space-y-6 lg:sticky lg:top-6">
            {/* Presets Row */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => applyPreset("no-website")}
                >
                  No Website
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => applyPreset("no-socials")}
                >
                  No Socials
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => applyPreset("high-rating")}
                >
                  High Rating (≥4.5)
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => applyPreset("restaurants")}
                >
                  Restaurants
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => applyPreset("salons")}
                >
                  Salons
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => applyPreset("dentists")}
                >
                  Dentists
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Location */}
            <div className="space-y-2 relative">
              <Label htmlFor="location">
                Location <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g., Sandton"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                  className="pl-9"
                />
              </div>
              {showLocationSuggestions && filteredLocations.length > 0 && (
                <Card className="absolute z-10 w-full mt-1 p-2 max-h-48 overflow-auto">
                  {filteredLocations.slice(0, 8).map((loc) => (
                    <button
                      key={loc}
                      className="w-full text-left px-3 py-2 rounded hover:bg-sidebar-accent text-sm"
                      onClick={() => {
                        setLocationQuery(loc);
                        setShowLocationSuggestions(false);
                      }}
                    >
                      {loc}
                    </button>
                  ))}
                </Card>
              )}
              {!locationQuery && (
                <p className="text-xs text-destructive">Location is required</p>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>
                Business Categories <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {searchStringsArray.map((cat) => (
                  <Badge key={cat} variant="default" className="gap-1">
                    {cat}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeCategory(cat)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom category..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCategory(newCategory);
                    }
                  }}
                  list="categories"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => addCategory(newCategory)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <datalist id="categories">
                {COMMON_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              {searchStringsArray.length === 0 && (
                <p className="text-xs text-destructive">At least one category is required</p>
              )}
            </div>

            {/* Result Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Max Results</Label>
                <span className="text-sm font-medium">{maxCrawledPlacesPerSearch[0]}</span>
              </div>
              <Slider
                value={maxCrawledPlacesPerSearch}
                onValueChange={setMaxCrawledPlacesPerSearch}
                min={20}
                max={1000}
                step={20}
              />
              <p className="text-xs text-muted-foreground">
                Higher limits may take longer to complete
              </p>
            </div>

            <Separator />

            {/* Filters Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Filters</h3>

              <div className="flex items-center justify-between">
                <Label htmlFor="skip-closed">Skip closed places</Label>
                <Switch
                  id="skip-closed"
                  checked={skipClosedPlaces}
                  onCheckedChange={setSkipClosedPlaces}
                />
              </div>

              <div className="space-y-2">
                <Label>Website Filter</Label>
                <Select value={website} onValueChange={setWebsite}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="withWebsite">With Website</SelectItem>
                    <SelectItem value="withoutWebsite">Without Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Socials Filter (experimental)</Label>
                <Select
                  value={withoutSocials ? "withoutSocials" : "any"}
                  onValueChange={(val) => setWithoutSocials(val === "withoutSocials")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="withoutSocials">Without Socials</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <Select value={placeMinimumStars} onValueChange={setPlaceMinimumStars}>
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="3.5">3.5+</SelectItem>
                    <SelectItem value="4.0">4.0+</SelectItem>
                    <SelectItem value="4.5">4.5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reviews Sort</Label>
                <Select value={reviewsSort} onValueChange={setReviewsSort}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="mostRelevant">Most Relevant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reviews Origin</Label>
                <Select value={reviewsOrigin} onValueChange={setReviewsOrigin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="tourist">Tourist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Data Collection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Data Collection</h3>

              <div className="flex items-center justify-between">
                <Label htmlFor="scrape-contacts">Scrape Contacts</Label>
                <Switch
                  id="scrape-contacts"
                  checked={scrapeContacts}
                  onCheckedChange={setScrapeContacts}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="include-web">Include Web Results</Label>
                <Switch
                  id="include-web"
                  checked={includeWebResults}
                  onCheckedChange={setIncludeWebResults}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="scrape-reviews">Scrape Reviews Personal Data</Label>
                <Switch
                  id="scrape-reviews"
                  checked={scrapeReviewsPersonalData}
                  onCheckedChange={setScrapeReviewsPersonalData}
                />
              </div>
            </div>

            <Separator />

            {/* Enrichment Limits */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Enrichment Limits</h3>

              <div className="space-y-2">
                <Label htmlFor="max-enrichment">Max Leads Enrichment Records</Label>
                <Input
                  id="max-enrichment"
                  type="number"
                  min="0"
                  value={maximumLeadsEnrichmentRecords}
                  onChange={(e) => setMaximumLeadsEnrichmentRecords(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-reviews-count">Max Reviews</Label>
                <Input
                  id="max-reviews-count"
                  type="number"
                  min="0"
                  value={maxReviews}
                  onChange={(e) => setMaxReviews(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-questions-count">Max Questions</Label>
                <Input
                  id="max-questions-count"
                  type="number"
                  min="0"
                  value={maxQuestions}
                  onChange={(e) => setMaxQuestions(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Advanced Section */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span className="font-semibold text-sm">Advanced Options</span>
                  <span className="text-xs text-muted-foreground">
                    {showAdvanced ? "Hide" : "Show"}
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scrape-dirs">Scrape Directories</Label>
                  <Switch
                    id="scrape-dirs"
                    checked={scrapeDirectories}
                    onCheckedChange={setScrapeDirectories}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="scrape-authors">Scrape Image Authors</Label>
                  <Switch
                    id="scrape-authors"
                    checked={scrapeImageAuthors}
                    onCheckedChange={setScrapeImageAuthors}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="scrape-detail">Scrape Place Detail Page</Label>
                  <Switch
                    id="scrape-detail"
                    checked={scrapePlaceDetailPage}
                    onCheckedChange={setScrapePlaceDetailPage}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="scrape-reservation">Scrape Table Reservation Provider</Label>
                  <Switch
                    id="scrape-reservation"
                    checked={scrapeTableReservationProvider}
                    onCheckedChange={setScrapeTableReservationProvider}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                className="w-full"
                size="lg"
                disabled={!isValid}
                onClick={onRunSearch}
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Run Search
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={onSavePreset}
              >
                Save as Preset
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: Preview + Status */}
        <div className="space-y-6">
          {/* JSON Preview */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Live JSON Preview</h3>
                <p className="text-xs text-muted-foreground">
                  Size: {(payloadSize / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={copyPayload}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
            <ScrollArea className="h-[400px] w-full">
              <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                {payloadString}
              </pre>
            </ScrollArea>
          </Card>

          {/* Job Status */}
          {jobStatus && (
            <Card className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Job Status</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: {jobStatus.id}
                  </p>
                </div>
                <Badge
                  variant={
                    jobStatus.status === "completed"
                      ? "default"
                      : jobStatus.status === "failed"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {jobStatus.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Started: {new Date(jobStatus.startedAt).toLocaleString()}
                </p>
                {jobStatus.status === "running" && (
                  <div className="space-y-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-pulse" style={{ width: "60%" }} />
                    </div>
                    <p className="text-xs text-muted-foreground">Processing...</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRefreshJob(jobStatus.id)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                {jobStatus.status === "completed" && (
                  <Button size="sm" onClick={() => onViewResults(jobStatus.id)}>
                    View Results
                  </Button>
                )}
                {jobStatus.status !== "completed" && jobStatus.status !== "failed" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onCancelJob(jobStatus.id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground pt-2 border-t">
                Powered by Apify Google Maps Scraper via n8n
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
