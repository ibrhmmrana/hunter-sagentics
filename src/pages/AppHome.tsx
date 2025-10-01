import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  FileText, 
  FolderPlus, 
  Link2, 
  TrendingUp, 
  Globe, 
  Users,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  Circle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data
const recentSearches = [
  { id: "1", location: "Sandton, ZA", categories: ["Restaurant", "Coffee"], maxResults: 200, status: "Completed", ranAt: "2 hours ago" },
  { id: "2", location: "Cape Town, ZA", categories: ["Salon", "Spa"], maxResults: 150, status: "Running", ranAt: "5 hours ago" },
  { id: "3", location: "Johannesburg, ZA", categories: ["Gym", "Fitness"], maxResults: 100, status: "Completed", ranAt: "1 day ago" },
  { id: "4", location: "Durban, ZA", categories: ["Dentist"], maxResults: 75, status: "Failed", ranAt: "2 days ago" },
  { id: "5", location: "Pretoria, ZA", categories: ["Auto repair"], maxResults: 120, status: "Completed", ranAt: "3 days ago" },
];

const savedLists = [
  { id: "1", name: "Sandton – Restaurants", count: 47, updatedAt: "2 hours ago" },
  { id: "2", name: "Cape Town – Salons", count: 23, updatedAt: "1 day ago" },
  { id: "3", name: "JHB – Gyms", count: 15, updatedAt: "3 days ago" },
];

const onboardingSteps = [
  { id: "connect-n8n", label: "Connect n8n webhook", completed: false },
  { id: "add-supabase", label: "Add Supabase keys", completed: false },
  { id: "first-search", label: "Run your first search", completed: false },
  { id: "save-list", label: "Save a list", completed: false },
];

export default function AppHome() {
  const navigate = useNavigate();
  const [onboarding, setOnboarding] = useState(onboardingSteps);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const toggleStep = (id: string) => {
    setOnboarding(prev => 
      prev.map(step => 
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-sidebar-border px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">How can Hunter help?</h1>
          <p className="text-sm text-muted-foreground">Find businesses missing web presence. Filter fast. Pitch smarter.</p>
        </div>
        <Button onClick={() => navigate("/app/scrape")}>
          <Search className="mr-2 h-4 w-4" />
          New Search
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump right in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex-col items-start p-4" onClick={() => navigate("/app/scrape")}>
                <Search className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-semibold">New Search</div>
                  <div className="text-xs text-muted-foreground mt-1">Send a query to your n8n webhook</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-start p-4" onClick={() => navigate("/app/results")}>
                <FileText className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-semibold">View Results</div>
                  <div className="text-xs text-muted-foreground mt-1">Browse your latest scraped leads</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-start p-4" onClick={() => navigate("/app/lists")}>
                <FolderPlus className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-semibold">Create List</div>
                  <div className="text-xs text-muted-foreground mt-1">Organize leads into collections</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-start p-4" onClick={() => navigate("/app/settings/connections")}>
                <Link2 className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-semibold">Connect n8n</div>
                  <div className="text-xs text-muted-foreground mt-1">Configure your webhook URL</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today at a glance (KPIs) */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Today at a glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>New leads</CardDescription>
                <CardTitle className="text-3xl">342</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span>+12% from yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>No website</CardDescription>
                <CardTitle className="text-3xl">78%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">267 of 342 leads</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>No socials</CardDescription>
                <CardTitle className="text-3xl">62%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">212 of 342 leads</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Credits remaining</CardDescription>
                <CardTitle className="text-3xl">310</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={77.5} className="h-2" />
                <div className="text-xs text-muted-foreground mt-2">310 / 400 used</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Onboarding Checklist */}
        {showOnboarding && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Get started with Hunter</CardTitle>
                  <CardDescription>Complete these steps to unlock full power</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowOnboarding(false)}>
                  Dismiss
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {onboarding.map((step) => (
                  <div 
                    key={step.id} 
                    className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    onClick={() => toggleStep(step.id)}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <span className={step.completed ? "line-through text-muted-foreground" : ""}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Searches */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Searches</CardTitle>
                  <CardDescription>Your last 5 search queries</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/app/scrape")}>
                  See all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentSearches.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No searches yet</p>
                  <Button variant="link" className="mt-2" onClick={() => navigate("/app/scrape")}>
                    Run your first search
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead className="text-right">Max</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ran</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSearches.map((search) => (
                      <TableRow key={search.id}>
                        <TableCell className="font-medium">{search.location}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {search.categories.map((cat) => (
                              <Badge key={cat} variant="secondary" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{search.maxResults}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              search.status === "Completed" ? "default" : 
                              search.status === "Running" ? "secondary" : 
                              "destructive"
                            }
                          >
                            {search.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{search.ranAt}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/app/results?queryId=${search.id}`)}
                          >
                            Open
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Saved Lists */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Saved Lists</CardTitle>
                  <CardDescription>Your collections</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/app/lists")}>
                  See all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {savedLists.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No lists yet</p>
                  <Button variant="link" className="mt-2" onClick={() => navigate("/app/lists")}>
                    Create your first list
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedLists.map((list) => (
                    <div 
                      key={list.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate("/app/lists")}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{list.name}</div>
                        <div className="text-xs text-muted-foreground">{list.count} leads · {list.updatedAt}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
