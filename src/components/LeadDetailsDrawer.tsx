/**
 * Lead details drawer/dialog component for viewing full lead information
 */

import { 
  Star, Globe, MapPin, Phone, ExternalLink, Calendar, Users,
  Facebook, Instagram, Linkedin, Twitter, Youtube, 
  Music, Pin, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lead } from '@/types/lead';
import LeadCover from '@/components/LeadCover';
import TimeAgo from '@/components/TimeAgo';

type Props = {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewContacts?: (placeId: string, title: string) => void;
};

// Helper functions - relativeTime moved to TimeAgo component

function isMaps(url?: string | null): boolean {
  if (!url) return false;
  return /maps\.google\.com|google\.com\/maps/i.test(url);
}

export default function LeadDetailsDrawer({ lead, open, onOpenChange, onViewContacts }: Props) {
  if (!lead) return null;

  // Social icons mapping
  const socialIcons = [
    { key: 'Facebook', url: lead.facebook, Icon: Facebook },
    { key: 'Instagram', url: lead.instagram, Icon: Instagram },
    { key: 'LinkedIn', url: lead.linkedin, Icon: Linkedin },
    { key: 'Twitter', url: lead.twitter, Icon: Twitter },
    { key: 'YouTube', url: lead.youtube, Icon: Youtube },
    { key: 'TikTok', url: lead.tiktok, Icon: Music },
    { key: 'Pinterest', url: lead.pinterest, Icon: Pin },
    { key: 'Discord', url: lead.discord, Icon: MessageSquare },
  ].filter(social => social.url);

  const website = lead.website ?? null;
  const isRealWebsite = !!website && !isMaps(website);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold">
            {lead.title || 'Business Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cover Image */}
          <LeadCover 
            title={lead.title}
            imageUrl={lead.image_url}
            aspect="16/9"
            rounded="lg"
          />

          {/* Basic Info */}
          <div className="space-y-4">
            {/* Title and Category */}
            <div>
              <h2 className="text-xl font-bold">{lead.title || 'Untitled'}</h2>
              {lead.category && (
                <p className="text-muted-foreground">{lead.category}</p>
              )}
            </div>

            {/* Location */}
            {(lead.city || lead.address) && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  {lead.address && <p>{lead.address}</p>}
                  {lead.city && <p className="text-muted-foreground">{lead.city}</p>}
                </div>
              </div>
            )}

            {/* Rating and Reviews */}
            {(lead.rating || lead.review_count) && (
              <div className="flex items-center gap-3">
                {lead.rating && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{lead.rating.toFixed(1)}</span>
                  </Badge>
                )}
                {lead.review_count && (
                  <span className="text-sm text-muted-foreground">
                    {lead.review_count.toLocaleString()} reviews
                  </span>
                )}
              </div>
            )}

            {/* Contact Info */}
            <div className="space-y-2">
              {lead.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-primary hover:underline"
                  >
                    {lead.phone}
                  </a>
                </div>
              )}

              {isRealWebsite && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Visit website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Created Date */}
            {lead.created_at && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <TimeAgo iso={lead.created_at} titlePrefix="Added" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-medium">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              {/* Google Maps */}
              {lead.url && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={lead.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    View on Maps
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              )}

              {/* Website */}
              {isRealWebsite && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Website
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              )}

              {/* Phone */}
              {lead.phone && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${lead.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </a>
                </Button>
              )}

              {/* View Contacts */}
              {onViewContacts && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewContacts(lead.place_id, lead.title || 'Business')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Contacts
                </Button>
              )}
            </div>
          </div>

          {/* Social Media */}
          {socialIcons.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="font-medium">Social Media</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {socialIcons.map(({ key, url, Icon }) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    asChild
                  >
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {key}
                      <ExternalLink className="ml-auto h-3 w-3" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
