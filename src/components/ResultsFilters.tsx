/**
 * Results page filters component with URL synchronization
 * Client component for managing search, sort, and pagination filters
 */


import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResultsFiltersProps {
  totalResults: number;
}

export default function ResultsFilters({ totalResults }: ResultsFiltersProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "recent";
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const website = (searchParams.get("website") as 'any' | 'none' | 'has') || "any";
  const socials = (searchParams.get("socials") as 'any' | 'none' | 'has') || "any";
  const contacted = (searchParams.get("contacted") as 'any' | 'no' | 'yes') || "any";

  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    // Reset to page 1 when filters change (except for page changes)
    if (!updates.page) {
      newParams.delete("page");
    }
    
    // Navigate with new params
    navigate(`/app/results?${newParams.toString()}`, { replace: true });
  }, [navigate, searchParams]);

  const handleSearchChange = useCallback((value: string) => {
    updateFilters({ q: value || null });
  }, [updateFilters]);

  const handleSortChange = useCallback((value: string) => {
    updateFilters({ sort: value === "recent" ? null : value });
  }, [updateFilters]);

  const handlePageSizeChange = useCallback((value: string) => {
    updateFilters({ pageSize: value === "20" ? null : value });
  }, [updateFilters]);

  const handleWebsiteChange = useCallback((value: string) => {
    updateFilters({ website: value === "any" ? null : value });
  }, [updateFilters]);

  const handleSocialsChange = useCallback((value: string) => {
    updateFilters({ socials: value === "any" ? null : value });
  }, [updateFilters]);

  const handleContactedChange = useCallback((value: string) => {
    updateFilters({ contacted: value === "any" ? null : value });
  }, [updateFilters]);

  const clearFilters = useCallback(() => {
    navigate("/app/results", { replace: true });
  }, [navigate]);

  const hasActiveFilters = q || sort !== "recent" || pageSize !== 20 || website !== "any" || socials !== "any" || contacted !== "any";

  return (
    <div className="border-b border-border px-6 py-4">
      <div className="flex flex-col gap-4">
        {/* Top row: Search and Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[300px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, category, city, or address…"
              value={q}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
              aria-label="Search leads"
            />
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-2">
            <Label htmlFor="sort-select" className="text-sm font-medium whitespace-nowrap">
              Sort by:
            </Label>
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[140px]" id="sort-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most recent</SelectItem>
                <SelectItem value="rating_desc">Rating ↓</SelectItem>
                <SelectItem value="rating_asc">Rating ↑</SelectItem>
                <SelectItem value="reviews_desc">Reviews ↓</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Page Size Select */}
          <div className="flex items-center gap-2">
            <Label htmlFor="pagesize-select" className="text-sm font-medium whitespace-nowrap">
              Show:
            </Label>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-[80px]" id="pagesize-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              aria-label="Clear all filters"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Second row: Website and Socials filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Website Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="website-select" className="text-sm font-medium whitespace-nowrap">
              Website:
            </Label>
            <Select value={website} onValueChange={handleWebsiteChange}>
              <SelectTrigger className="w-[140px]" id="website-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="none">No website</SelectItem>
                <SelectItem value="has">Has website</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Socials Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="socials-select" className="text-sm font-medium whitespace-nowrap">
              Socials:
            </Label>
            <Select value={socials} onValueChange={handleSocialsChange}>
              <SelectTrigger className="w-[140px]" id="socials-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="none">No socials</SelectItem>
                <SelectItem value="has">Has socials</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contacted Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="contacted-select" className="text-sm font-medium whitespace-nowrap">
              Contacted:
            </Label>
            <Select value={contacted} onValueChange={handleContactedChange}>
              <SelectTrigger className="w-[140px]" id="contacted-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="no">Not contacted</SelectItem>
                <SelectItem value="yes">Contacted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {totalResults === 0 ? (
            "No leads found"
          ) : totalResults === 1 ? (
            "1 lead found"
          ) : (
            `${totalResults.toLocaleString()} leads found`
          )}
        </div>
      </div>
    </div>
  );
}
