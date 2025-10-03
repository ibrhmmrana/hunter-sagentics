import { useQuery } from '@tanstack/react-query';
import { Mail, Linkedin, Copy, User, Phone, Building, X, Users } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { LeadContact } from '@/types/contact';
import { listContactsByPlaceId } from '@/data/contacts';
import { initials } from '@/lib/images';
import { toast } from 'sonner';

type Props = {
  placeId: string;
  title: string;
  open: boolean;
  onClose: () => void;
};

export default function LeadContactsPanel({ placeId, title, open, onClose }: Props) {
  // Use React Query for data fetching
  const { data: contacts = [], isLoading: loading, error: queryError } = useQuery<LeadContact[]>({
    queryKey: ['contacts', placeId],
    queryFn: () => listContactsByPlaceId(placeId, 5),
    enabled: !!placeId && open,
    staleTime: 60_000, // 1 minute
    retry: 1,
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

  const formatRelativeTime = (dateStr?: string | null): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:w-[420px] sm:max-w-[420px] flex flex-col rounded-lg" side="right">
        <SheetHeader className="pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Contacts
              {contacts.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {contacts.length}
                </Badge>
              )}
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              aria-label="Close contacts panel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription className="text-sm text-muted-foreground">
            People associated with {title || 'this business'}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-4">
            {loading && (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{error}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Please check your connection and try again
                </p>
              </div>
            )}

            {!loading && !error && contacts.length === 0 && (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No contacts found for this business</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Contacts will appear here when they become available
                </p>
              </div>
            )}

            {!loading && !error && contacts.length > 0 && (
              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {initials(formatName(contact))}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        {/* Name and Title */}
                        <div className="mb-2">
                          <p className="font-semibold text-sm truncate" title={formatName(contact)}>
                            {formatName(contact)}
                          </p>
                          <p className="text-xs text-muted-foreground truncate" title={contact.title || ''}>
                            {contact.title || '—'}
                          </p>
                        </div>

                        {/* Department/Seniority Chips */}
                        {(contact.department || contact.seniority) && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {contact.department && (
                              <Badge variant="outline" className="text-[0.65rem] px-1.5 py-0.5 h-auto">
                                {contact.department}
                              </Badge>
                            )}
                            {contact.seniority && (
                              <Badge variant="outline" className="text-[0.65rem] px-1.5 py-0.5 h-auto">
                                {contact.seniority}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Sub-row: Phone, Company, Created */}
                        <div className="space-y-1">
                          {contact.phone && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <a 
                                href={`tel:${contact.phone}`} 
                                className="hover:text-foreground transition-colors"
                              >
                                {contact.phone}
                              </a>
                            </p>
                          )}
                          {contact.company_name && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                              <Building className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate" title={contact.company_name}>
                                {contact.company_name}
                              </span>
                            </p>
                          )}
                          {contact.created_at && (
                            <p className="text-xs text-muted-foreground">
                              Added {formatRelativeTime(contact.created_at)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Icons */}
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        {contact.email && (
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0"
                              asChild
                              title="Send email"
                            >
                              <a href={`mailto:${contact.email}`}>
                                <Mail className="h-3 w-3" />
                              </a>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0"
                              onClick={() => copyEmail(contact.email!)}
                              title="Copy email"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {contact.linkedin_url && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            asChild
                            title="View LinkedIn profile"
                          >
                            <a 
                              href={contact.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Linkedin className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
