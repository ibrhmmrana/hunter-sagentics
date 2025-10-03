import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { scrapeSchema, ScrapeForm } from "@/types/scrape";
import { startScrape } from "@/data/scrape";

// Location suggestions
const SA_LOCATIONS = [
  "Sandton", "Rosebank", "Cape Town", "Durban", "Pretoria", "Johannesburg"
];

// Common business types
const BUSINESS_TYPES = [
  "Restaurant", "Salon", "Dentist", "Gym", "Coffee shop", 
  "Bakery", "Auto repair", "Real estate", "Hardware store", "Pharmacy"
];

// Presets that autofill form fields
const PRESETS: Array<{
  label: string;
  location: string;
  businessType: string[];
  websiteRequirement: "any" | "with" | "without";
  leadCount: number;
}> = [
  { label: "Sandton · Restaurants · No Website · 200", location: "Sandton", businessType: ["Restaurant"], websiteRequirement: "without", leadCount: 200 },
  { label: "Rosebank · Gyms · No Website · 150", location: "Rosebank", businessType: ["Gym"], websiteRequirement: "without", leadCount: 150 },
  { label: "Cape Town · Salons · No Website · 100", location: "Cape Town", businessType: ["Salon"], websiteRequirement: "without", leadCount: 100 },
  { label: "Johannesburg · Coffee shops · With Website · 50", location: "Johannesburg", businessType: ["Coffee shop"], websiteRequirement: "with", leadCount: 50 },
];

interface JobStatus {
  jobId: string;
  status: "Queued" | "Running" | "Completed" | "Failed";
  startedAt: string;
}

export default function AppScrape() {
  const navigate = useNavigate();
  
  // Form state
  const [form, setForm] = useState<ScrapeForm>({
    location: "",
    businessType: [],
    websiteRequirement: "any",
    leadCount: 50,
  });
  
  const [businessTypeInput, setBusinessTypeInput] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showBusinessTypeSuggestions, setShowBusinessTypeSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation
  const isValid = form.location.length >= 2 && form.businessType.length >= 1;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("scrape:last");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm({
          location: parsed.location || "",
          businessType: parsed.businessType || [],
          websiteRequirement: parsed.websiteRequirement || "any",
          leadCount: parsed.leadCount || 50,
        });
      } catch (e) {
        console.error("Failed to parse saved form", e);
      }
    }
  }, []);

  // Form update helper
  const updateForm = (updates: Partial<ScrapeForm>) => {
    setForm(prev => ({ ...prev, ...updates }));
    setErrors({}); // Clear errors when form changes
  };

  // Business type helpers
  const addBusinessType = (type: string) => {
    const trimmed = type.trim();
    if (trimmed && !form.businessType.includes(trimmed)) {
      updateForm({ businessType: [...form.businessType, trimmed] });
      setBusinessTypeInput("");
    }
  };

  const removeBusinessType = (type: string) => {
    updateForm({ businessType: form.businessType.filter(t => t !== type) });
  };

  const handleBusinessTypeInput = (value: string) => {
    setBusinessTypeInput(value);
    // Auto-add on comma
    if (value.includes(',')) {
      const types = value.split(',').map(s => s.trim()).filter(Boolean);
      types.forEach(type => addBusinessType(type));
    }
  };

  // Submit handler
  const onRunSearch = async () => {
    try {
      setLoading(true);
      setErrors({});

      // Normalize business types from input if any
      if (businessTypeInput.trim()) {
        const types = businessTypeInput.split(',').map(s => s.trim()).filter(Boolean);
        types.forEach(type => addBusinessType(type));
      }

      // Validate form
      const result = scrapeSchema.safeParse(form);
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.errors.forEach(error => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        return;
      }

      // Start scrape (this will check authentication internally)
      const { clientQueryId } = await startScrape(result.data);

      // Save form to localStorage
      localStorage.setItem("scrape:last", JSON.stringify(result.data));

      // Show success and redirect
      toast.success("Search queued. Results will start appearing shortly.");
      navigate(`/app/results?clientQueryId=${clientQueryId}`);

    } catch (error: any) {
      console.error("Scrape submission error:", error);
      
      // Check if it's an authentication error
      if (error.message?.includes("Please sign in first")) {
        toast.error("Please sign in first.");
      } else {
        toast.error("Couldn't queue your search. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onPresetClick = (presetIndex: number) => {
    const preset = PRESETS[presetIndex];
    setForm({
      location: preset.location,
      businessType: preset.businessType,
      websiteRequirement: preset.websiteRequirement,
      leadCount: preset.leadCount,
    });
    setBusinessTypeInput("");
    setErrors({});
    toast.success("Preset applied", { description: preset.label });
  };

  const filteredLocations = SA_LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(form.location.toLowerCase())
  );

  const filteredBusinessTypes = BUSINESS_TYPES.filter((type) =>
    type.toLowerCase().includes(businessTypeInput.toLowerCase())
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
                  value={form.location}
                  onChange={(e) => updateForm({ location: e.target.value })}
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
                        updateForm({ location: loc });
                        setShowLocationSuggestions(false);
                      }}
                    >
                      {loc}
                    </button>
                  ))}
                </Card>
              )}
              {errors.location && (
                <p className="text-xs text-destructive">{errors.location}</p>
              )}
            </div>

            {/* Business Types */}
            <div className="space-y-2 relative">
              <Label htmlFor="business-type" className="text-base font-medium">
                Business type(s) <span className="text-destructive">*</span>
              </Label>
              {form.businessType.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.businessType.map((type) => (
                    <Badge key={type} variant="default" className="gap-1.5 px-3 py-1">
                      {type}
                      <button
                        type="button"
                        onClick={() => removeBusinessType(type)}
                        className="hover:bg-background/20 rounded-full"
                        aria-label={`Remove ${type}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="relative">
                <Input
                  id="business-type"
                  placeholder="e.g., Restaurant, Gym, Salon (comma-separated)"
                  value={businessTypeInput}
                  onChange={(e) => handleBusinessTypeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addBusinessType(businessTypeInput);
                    }
                  }}
                  onFocus={() => setShowBusinessTypeSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowBusinessTypeSuggestions(false), 200)}
                  className="h-12 text-base"
                  aria-required="true"
                />
              </div>
              {showBusinessTypeSuggestions && filteredBusinessTypes.length > 0 && (
                <Card className="absolute z-50 w-full mt-1 p-1 max-h-48 overflow-auto bg-popover border-border shadow-lg">
                  {filteredBusinessTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="w-full text-left px-3 py-2 rounded hover:bg-accent text-sm transition-colors"
                      onClick={() => {
                        addBusinessType(type);
                        setShowBusinessTypeSuggestions(false);
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </Card>
              )}
              {errors.businessType && (
                <p className="text-xs text-destructive">{errors.businessType}</p>
              )}
              <p className="text-xs text-muted-foreground">Type and press Enter or use commas to add multiple types</p>
            </div>

            {/* Website Requirement */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Website requirement</Label>
              <ToggleGroup
                type="single"
                value={form.websiteRequirement}
                onValueChange={(val) => {
                  if (val === "with" || val === "without" || val === "any") {
                    updateForm({ websiteRequirement: val });
                  }
                }}
                className="justify-start gap-2"
                aria-label="Website requirement"
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

            {/* Lead Count */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Lead count</Label>
                <span className="text-lg font-semibold">{form.leadCount}</span>
              </div>
              <Slider
                value={[form.leadCount]}
                onValueChange={(value) => updateForm({ leadCount: value[0] })}
                min={10}
                max={200}
                step={10}
                className="py-2"
                aria-label={`Lead count: ${form.leadCount}`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10</span>
                <span>200</span>
              </div>
              {errors.leadCount && (
                <p className="text-xs text-destructive">{errors.leadCount}</p>
              )}
            </div>

            {/* Run Search Button */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full h-12 text-base font-medium"
                onClick={onRunSearch}
                disabled={!isValid || loading}
                aria-label="Run search"
              >
                {loading ? "Submitting..." : "Run Search"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Results will stream into the Results page. Sorting/filters apply as they arrive.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
