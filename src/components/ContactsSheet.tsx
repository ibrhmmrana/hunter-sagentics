/**
 * ContactsSheet component for displaying full contact details in a side panel
 */

import { useQuery } from '@tanstack/react-query';
import { Mail, Linkedin, Copy, User, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { LeadContact } from '@/types/contact';
import { listContactsForPlace } from '@/data/contacts';
import { initials } from '@/lib/images';
import { toast } from 'sonner';

type Props = {
  placeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
};

export default function ContactsSheet({ placeId, open, onOpenChange, title }: Props) {
  // Use React Query for data fetching with better error handling
  const { data: contacts = [], isLoading: loading, error: queryError } = useQuery<LeadContact[]>({
    queryKey: ['contacts', placeId],
    queryFn: () => listContactsForPlace(placeId, 5),
    enabled: !!placeId && open,
    staleTime: 60_000, // 1 minute
    retry: 1, // Only retry once to avoid infinite loops
  });

  const error = queryError ? 'Failed to load contacts' : null;

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success('Email copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy email');
    }
  };

  const formatName = (contact: LeadContact): string => {
    if (contact.full_name) return contact.full_name;
    if (contact.first_name || contact.last_name) {
      return [contact.first_name, contact.last_name].filter(Boolean).join(' ');
    }
    return 'Unknown';
  };

  const formatLocation = (contact: LeadContact): string => {
    const parts = [contact.city, contact.state, contact.country].filter(Boolean);
    return parts.join(', ') || '';
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contacts
          </SheetTitle>
          <SheetDescription>
            People associated with {title || 'this business'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-6 pr-2">
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Please check your connection and try again
              </p>
            </div>
          )}

          {!loading && !error && contacts.length === 0 && (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No contacts yet for this business</p>
              <p className="text-xs text-muted-foreground mt-2">
                Contacts will appear here when they become available
              </p>
            </div>
          )}

          {!loading && !error && contacts.length > 0 && (
            <div className="space-y-4">
              {contacts.map((contact, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {initials(formatName(contact))}
                      </AvatarFallback>
                    </Avatar>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-sm truncate">
                            {formatName(contact)}
                          </h4>
                          
                          {contact.title && (
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {contact.title}
                            </p>
                          )}

                          {contact.seniority && (
                            <Badge variant="secondary" className="text-xs mt-2">
                              {contact.seniority}
                            </Badge>
                          )}

                          {contact.department && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Building className="h-3 w-3" />
                              <span className="truncate">{contact.department}</span>
                            </div>
                          )}

                          {formatLocation(contact) && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{formatLocation(contact)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-3">
                        {contact.email && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              asChild
                            >
                              <a href={`mailto:${contact.email}`}>
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => copyEmail(contact.email!)}
                              title="Copy email"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </>
                        )}

                        {contact.linkedin_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            asChild
                          >
                            <a
                              href={contact.linkedin_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Linkedin className="h-3 w-3 mr-1" />
                              LinkedIn
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
