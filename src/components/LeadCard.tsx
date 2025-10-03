/**
 * Lead card component for grid view with cover image and details
 */

import { 
  Star, Globe, MapPin, Phone, ExternalLink, Check,
  Facebook, Instagram, Linkedin, Twitter, Youtube, 
  Music, Pin, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Lead } from '@/types/lead';
import LeadCover from '@/components/LeadCover';
import ContactsCountBadge from '@/components/ContactsCountBadge';
import TimeAgo from '@/components/TimeAgo';

type Props = {
  lead: Lead;
  onOpen?: (lead: Lead) => void;
  onViewContacts?: (placeId: string, title: string) => void;
  onToggleContacted?: (placeId: string, contacted: boolean) => void;
};

// Helper to check if URL is Google Maps
function isMaps(url?: string | null): boolean {
  if (!url) return false;
  return /maps\.google\.com|google\.com\/maps/i.test(url);
}

export default function LeadCard({ lead, onOpen, onViewContacts, onToggleContacted }: Props) {
  const handleCardClick = () => {
    onOpen?.(lead);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen?.(lead);
    }
  };

  // Social icons mapping
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
    <Card 
      className="group cursor-pointer shadow-sm hover:shadow-md transition-shadow border rounded-xl overflow-hidden"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${lead.title || 'business'}`}
    >
      <CardContent className="p-0">
        {/* Cover Image */}
        <LeadCover 
          title={lead.title}
          imageUrl={lead.image_url}
          aspect="16/9"
          rounded="lg"
          className="rounded-b-none"
        />
        
        {/* Card Content */}
        <div className="p-3 md:p-4 space-y-3">
          {/* Title and Location */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 
                className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors"
                title={lead.title || 'Untitled'}
              >
                {lead.title || 'Untitled'}
              </h3>
              {lead.contacted && onToggleContacted && (
                <Badge 
                  variant="default" 
                  className="text-xs bg-green-100 text-green-800 border-green-200 cursor-pointer hover:bg-green-200 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleContacted(lead.place_id, false);
                  }}
                  title="Click to mark as not contacted"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Contacted
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {[lead.category, lead.city].filter(Boolean).join(' • ') || '—'}
            </p>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-2">
            {lead.rating ? (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{lead.rating.toFixed(1)}</span>
              </Badge>
            ) : null}
            {lead.review_count ? (
              <span className="text-xs text-muted-foreground">
                {lead.review_count.toLocaleString()} reviews
              </span>
            ) : null}
          </div>


          {/* Phone */}
          {lead.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <a
                href={`tel:${lead.phone}`}
                className="text-xs text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Call ${lead.phone}`}
              >
                {lead.phone}
              </a>
            </div>
          )}

          {/* Contacts and Socials Badges */}
          <div className="flex items-center gap-2">
            {/* Contacts Count Badge */}
            {onViewContacts && (
              <ContactsCountBadge
                placeId={lead.place_id}
                onClick={() => onViewContacts(lead.place_id, lead.title || "Business")}
              />
            )}
            
            {/* Socials Badge */}
            {socialIcons.length > 0 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                {socialIcons.length} {socialIcons.length === 1 ? 'social' : 'socials'}
              </Badge>
            )}
          </div>

          {/* Bottom Actions - Optimized Layout */}
          <div className="pt-2 border-t border-border">
            {/* Top row - Quick Actions and Timestamp */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                {/* Website */}
                {isRealWebsite ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={website}
                      target="_blank"
                      rel="noreferrer"
                      title="Visit website"
                      aria-label="Visit website"
                    >
                      <Globe className="h-3 w-3" />
                    </a>
                  </Button>
                ) : null}

                {/* Google Maps */}
                {lead.url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={lead.url}
                      target="_blank"
                      rel="noreferrer"
                      title="View on Google Maps"
                      aria-label="View on Google Maps"
                    >
                      <MapPin className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>

              {/* Timestamp - Top Right */}
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                <TimeAgo iso={lead.created_at} />
              </div>
            </div>

            {/* Bottom row - Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Contacted toggle - only show if not contacted yet */}
              {onToggleContacted && !lead.contacted && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-6 px-2 flex-1 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleContacted(lead.place_id, true);
                  }}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark Contacted
                </Button>
              )}
              
              {/* View details - takes full width when lead is contacted */}
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs h-6 px-2 ${lead.contacted ? 'w-full' : 'flex-1'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen?.(lead);
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
