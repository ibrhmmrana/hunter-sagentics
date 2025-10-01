import { X, Star, Globe, Phone, MapPin, ExternalLink, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Lead } from "@/data/mockLeads";
import { toast } from "sonner";

interface LeadDetailDrawerProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onAddToList: (leadId: string) => void;
}

export function LeadDetailDrawer({ lead, open, onClose, onAddToList }: LeadDetailDrawerProps) {
  if (!lead) return null;

  const hasSocials = !!(lead.facebook || lead.instagram || lead.twitter || lead.linkedin || lead.tiktok);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const openInMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lead.latitude},${lead.longitude}`, "_blank");
  };

  // Mock activity data
  const activities = [
    { date: "2024-01-15", action: "Added to list 'Sandton Prospects'" },
    { date: "2024-01-14", action: "Exported to CSV" },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg overflow-hidden flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-xl">{lead.title}</SheetTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {lead.category}
                </Badge>
                <span className="text-sm text-muted-foreground">{lead.city}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b px-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="overview" className="px-6 py-4 space-y-6 m-0">
              {/* Rating */}
              {lead.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{lead.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({lead.reviewsCount} reviews)
                  </span>
                </div>
              )}

              {/* Website */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="h-4 w-4" />
                  <span>Website</span>
                </div>
                {lead.website ? (
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {lead.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <Badge variant="secondary">None</Badge>
                )}
              </div>

              {/* Socials */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>Social Media</span>
                </div>
                {hasSocials ? (
                  <div className="flex flex-wrap gap-2">
                    {lead.facebook && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={lead.facebook} target="_blank" rel="noopener noreferrer">
                          Facebook
                        </a>
                      </Button>
                    )}
                    {lead.instagram && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={lead.instagram} target="_blank" rel="noopener noreferrer">
                          Instagram
                        </a>
                      </Button>
                    )}
                    {lead.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={lead.twitter} target="_blank" rel="noopener noreferrer">
                          X/Twitter
                        </a>
                      </Button>
                    )}
                    {lead.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={lead.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <Badge variant="secondary">None</Badge>
                )}
              </div>

              <Separator />

              {/* Contact Info */}
              {lead.phone && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4" />
                    <span>Phone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{lead.phone}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(lead.phone!, "Phone")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Address */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  <span>Address</span>
                </div>
                <p className="text-sm text-muted-foreground">{lead.address}</p>
                <Button variant="outline" size="sm" onClick={openInMaps}>
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Open in Maps
                </Button>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button className="w-full" onClick={() => onAddToList(lead.id)}>
                  Add to List
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    Export vCard
                  </Button>
                  <Button variant="outline" size="sm">
                    Mark Contacted
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="px-6 py-4 space-y-4 m-0">
              {lead.emails && lead.emails.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    <span>Emails</span>
                  </div>
                  {lead.emails.map((email, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm">{email}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(email, "Email")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {lead.phone && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4" />
                    <span>Phone Numbers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Primary</Badge>
                    <span className="text-sm">{lead.phone}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(lead.phone!, "Phone")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {hasSocials && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Social Links</div>
                  <div className="space-y-1">
                    {lead.facebook && (
                      <div className="flex items-center justify-between text-sm p-2 rounded hover:bg-sidebar-accent">
                        <span>Facebook</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(lead.facebook!, "Facebook URL")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    {lead.instagram && (
                      <div className="flex items-center justify-between text-sm p-2 rounded hover:bg-sidebar-accent">
                        <span>Instagram</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(lead.instagram!, "Instagram URL")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!lead.emails && !lead.phone && !hasSocials && (
                <p className="text-sm text-muted-foreground">No contact information available</p>
              )}
            </TabsContent>

            <TabsContent value="activity" className="px-6 py-4 space-y-4 m-0">
              <div className="space-y-3">
                {activities.map((activity, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="raw" className="px-6 py-4 m-0">
              <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(lead, null, 2)}
              </pre>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="border-t px-6 py-4 flex gap-2">
          <Button className="flex-1" onClick={() => onAddToList(lead.id)}>
            Add to List
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
