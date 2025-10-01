import { useNavigate } from "react-router-dom";
import { Search, Table as TableIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data
const recentSearches = [
  { id: "1", location: "Sandton, ZA", categories: ["Restaurant", "Coffee"], status: "Completed" },
  { id: "2", location: "Cape Town, ZA", categories: ["Salon"], status: "Running" },
  { id: "3", location: "Johannesburg, ZA", categories: ["Gym"], status: "Completed" },
];

const savedLists = [
  { id: "1", name: "Sandton — Restaurants", count: 47, updatedAt: "2h ago" },
  { id: "2", name: "Cape Town — Salons", count: 23, updatedAt: "1d ago" },
  { id: "3", name: "JHB — Gyms", count: 15, updatedAt: "3d ago" },
];

const quickPresets = [
  { label: "Restaurants · No Website", filters: { category: "restaurants", missing: "website" } },
  { label: "Salons · No Socials", filters: { category: "salons", missing: "socials" } },
  { label: "Dentists · ≥4.5⭐", filters: { category: "dentists", rating: "4.5+" } },
  { label: "Gyms · Sandton", filters: { category: "gyms", location: "Sandton" } },
];

export default function AppHome() {
  const navigate = useNavigate();

  // onStartNewSearch - navigate to scrape page
  const onStartNewSearch = () => navigate("/app/scrape");
  
  // onOpenResults - navigate to results page
  const onOpenResults = () => navigate("/app/results");
  
  // onCreateList - navigate to lists page
  const onCreateList = () => navigate("/app/lists");
  
  // onPresetClick - navigate to scrape with prefilled state (stubbed)
  const onPresetClick = (preset: typeof quickPresets[0]) => {
    console.log("Preset clicked:", preset);
    navigate("/app/scrape");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">Hey, Hunter is ready.</h1>
          <p className="text-muted-foreground text-base">Find businesses missing web presence — fast.</p>
        </div>

        {/* Row 1: Primary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="rounded-2xl border-border shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            onClick={onStartNewSearch}
          >
            <CardHeader className="space-y-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">New Search</CardTitle>
              <p className="text-sm text-muted-foreground">
                Look up businesses by location & category.
              </p>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Start a search
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="rounded-2xl border-border shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            onClick={onOpenResults}
          >
            <CardHeader className="space-y-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TableIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">View Results</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review the latest leads you found.
              </p>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" size="lg">
                Open results
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Spotlight */}
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Opportunities right now</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-6xl font-bold">128</p>
              <div className="flex items-center justify-center gap-3">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  No website 78%
                </Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  No socials 62%
                </Badge>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">Based on your last 7 days.</p>
          </CardContent>
        </Card>

        {/* Row 3: Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Searches */}
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg">Recent Searches</CardTitle>
              <Button 
                variant="link" 
                size="sm" 
                className="text-sm"
                onClick={() => navigate("/app/results")}
              >
                See all
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentSearches.map((search) => (
                <div 
                  key={search.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {search.location}
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {search.categories.map((cat) => (
                        <Badge key={cat} variant="secondary" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                      <Badge 
                        variant={search.status === "Completed" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {search.status}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/app/results?queryId=${search.id}`)}
                  >
                    Open
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Saved Lists */}
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader className="space-y-4">
              <CardTitle className="text-lg">Saved Lists</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {savedLists.map((list) => (
                <div 
                  key={list.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate("/app/lists")}
                >
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{list.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {list.count} leads • {list.updatedAt}
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={onCreateList}
              >
                Create List
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer: Quick Presets */}
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick presets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {quickPresets.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => onPresetClick(preset)}
                  className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-sm transition-colors"
                  aria-label={`Apply preset: ${preset.label}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
