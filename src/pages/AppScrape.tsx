import { useState, useEffect } from "react";
import { RefreshCw, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";

// Location suggestions
const SA_LOCATIONS = [
  "Sandton", "Rosebank", "Cape Town", "Durban", "Pretoria", "Johannesburg"
];

// Common business types
const BUSINESS_TYPES = [
  "Restaurant", "Salon", "Dentist", "Gym", "Coffee shop", 
  "Bakery", "Auto repair", "Real estate", "Hardware store", "Pharmacy"
];

// Presets that autofill all four fields
const PRESETS: Array<{
  label: string;
  location: string;
  businessType: string;
  websiteReq: "with" | "without" | "any";
  leads: number;
}> = [
  { label: "Sandton · Restaurants · No Website · 200", location: "Sandton", businessType: "Restaurant", websiteReq: "without", leads: 200 },
  { label: "Rosebank · Gyms · No Website · 150", location: "Rosebank", businessType: "Gym", websiteReq: "without", leads: 150 },
  { label: "Cape Town · Salons · No Website · 300", location: "Cape Town", businessType: "Salon", websiteReq: "without", leads: 300 },
  { label: "Johannesburg · Coffee shops · With Website · 100", location: "Johannesburg", businessType: "Coffee shop", websiteReq: "with", leads: 100 },
];

interface JobStatus {
  jobId: string;
  status: "Queued" | "Running" | "Completed" | "Failed";
  startedAt: string;
}

export default function AppScrape() {
  // Form state (only 4 fields)
  const [location, setLocation] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [customBusinessType, setCustomBusinessType] = useState("");
  const [websiteRequirement, setWebsiteRequirement] = useState<"with" | "without" | "any">("any");
  const [leadCount, setLeadCount] = useState([200]);
  
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);

  // Validation
  const isValid = location.trim() !== "" && (businessType !== "" || customBusinessType.trim() !== "");
  
  // Get final business type (dropdown or custom)
  const finalBusinessType = businessType === "custom" ? customBusinessType : businessType;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("hunter_minimal_search");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLocation(parsed.location || "");
        setBusinessType(parsed.businessType || "");
        setCustomBusinessType(parsed.customBusinessType || "");
        setWebsiteRequirement(parsed.websiteRequirement || "any");
        setLeadCount([parsed.leadCount || 200]);
      } catch (e) {
        console.error("Failed to parse saved form", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("hunter_minimal_search", JSON.stringify({
      location,
      businessType,
      customBusinessType,
      websiteRequirement,
      leadCount: leadCount[0]
    }));
  }, [location, businessType, customBusinessType, websiteRequirement, leadCount]);

  // Mock handlers - comment stubs only
  const onRunSearch = () => {
    // TODO: Integrate with backend
    // onRunSearch({ location, businessType: finalBusinessType, websiteRequirement, leadCount: leadCount[0] })
    console.log("onRunSearch", { location, businessType: finalBusinessType, websiteRequirement, leadCount: leadCount[0] });

    const mockJobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setJobStatus({
      jobId: mockJobId,
      status: "Queued",
      startedAt: new Date().toLocaleString(),
    });

    toast.success("Search started!", {
      description: `Job ID: ${mockJobId}`,
    });
  };

  const onRefreshJob = () => {
    // TODO: Poll job status
    // onRefreshJob(jobStatus?.jobId)
    console.log("onRefreshJob", jobStatus?.jobId);
    if (jobStatus && jobStatus.status === "Queued") {
      setJobStatus({ ...jobStatus, status: "Running" });
      toast.info("Job is now running");
    }
  };

  const onViewResults = () => {
    // TODO: Navigate to results
    // onViewResults(jobId)
    console.log("onViewResults", jobStatus?.jobId);
    window.location.href = `/app/results?queryId=${jobStatus?.jobId}`;
  };

  const onPresetClick = (presetIndex: number) => {
    // TODO: Apply preset
    // onPresetClick(presetId)
    const preset = PRESETS[presetIndex];
    setLocation(preset.location);
    setBusinessType(preset.businessType);
    setCustomBusinessType("");
    setWebsiteRequirement(preset.websiteReq);
    setLeadCount([preset.leads]);
    toast.success("Preset applied", { description: preset.label });
  };

  const filteredLocations = SA_LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold">New Search</h1>
        <p className="text-sm text-muted-foreground">Tell Hunter what to find.</p>
      </div>

      {/* Main Content - Centered Card */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-2xl shadow-md border-border p-8 space-y-8">
            {/* Job Status (slim, at top of card when active) */}
            {jobStatus && (
              <div className="pb-6 border-b border-border">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Job ID: </span>
                      <span className="font-mono">{jobStatus.jobId.slice(0, 12)}</span>
                    </div>
                    <Badge variant={jobStatus.status === "Completed" ? "default" : jobStatus.status === "Running" ? "secondary" : "outline"}>
                      {jobStatus.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={onRefreshJob}>
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                    <Button size="sm" onClick={onViewResults}>
                      View Results
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Presets */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick presets</Label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5"
                    onClick={() => onPresetClick(idx)}
                  >
                    {preset.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2 relative">
              <Label htmlFor="location" className="text-base font-medium">
                Location <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="location"
                  placeholder="e.g., Sandton"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                  className="pl-10 h-12 text-base"
                  aria-required="true"
                />
              </div>
              {showLocationSuggestions && filteredLocations.length > 0 && (
                <Card className="absolute z-50 w-full mt-1 p-1 max-h-48 overflow-auto bg-popover border-border shadow-lg">
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      className="w-full text-left px-3 py-2 rounded hover:bg-accent text-sm transition-colors"
                      onClick={() => {
                        setLocation(loc);
                        setShowLocationSuggestions(false);
                      }}
                    >
                      {loc}
                    </button>
                  ))}
                </Card>
              )}
              <p className="text-xs text-muted-foreground">e.g., Sandton</p>
            </div>

            {/* Business Type */}
            <div className="space-y-2">
              <Label htmlFor="business-type" className="text-base font-medium">
                Business type <span className="text-destructive">*</span>
              </Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger id="business-type" className="h-12 text-base" aria-required="true">
                  <SelectValue placeholder="Pick a type or enter your own" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom...</SelectItem>
                </SelectContent>
              </Select>
              {businessType === "custom" && (
                <Input
                  placeholder="Enter custom business type"
                  value={customBusinessType}
                  onChange={(e) => setCustomBusinessType(e.target.value)}
                  className="h-12 text-base mt-2"
                />
              )}
              <p className="text-xs text-muted-foreground">Pick a type or enter your own</p>
            </div>

            {/* Website Requirement */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Website requirement</Label>
              <ToggleGroup
                type="single"
                value={websiteRequirement}
                onValueChange={(val) => {
                  if (val === "with" || val === "without" || val === "any") {
                    setWebsiteRequirement(val);
                  }
                }}
                className="justify-start gap-2"
                aria-label="Website requirement filter"
              >
                <ToggleGroupItem value="with" className="h-12 px-6 text-base" aria-label="With website">
                  With website
                </ToggleGroupItem>
                <ToggleGroupItem value="without" className="h-12 px-6 text-base" aria-label="Without website">
                  Without website
                </ToggleGroupItem>
                <ToggleGroupItem value="any" className="h-12 px-6 text-base" aria-label="Any">
                  Any
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Leads to Generate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Leads to generate</Label>
                <span className="text-lg font-semibold">{leadCount[0]}</span>
              </div>
              <Slider
                value={leadCount}
                onValueChange={setLeadCount}
                min={10}
                max={1000}
                step={10}
                className="py-2"
                aria-label={`Leads to generate: ${leadCount[0]}`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10</span>
                <span>1000</span>
              </div>
            </div>

            {/* Run Search Button */}
            <Button
              size="lg"
              className="w-full h-12 text-base font-medium"
              onClick={onRunSearch}
              disabled={!isValid}
              aria-label="Run search"
            >
              Run Search
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
