/**
 * ContactPreview component for showing contact chips in the Results table
 */

import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { previewContactsForPlace, countContacts } from '@/data/contacts';
import { LeadContact } from '@/types/contact';
import { useMemo } from 'react';

type Props = {
  placeId: string;
  onViewContacts: () => void;
};

export default function ContactPreview({ placeId, onViewContacts }: Props) {
  const { data: contacts = [], isLoading } = useQuery<LeadContact[]>({
    queryKey: ['contacts-preview', placeId],
    queryFn: () => previewContactsForPlace(placeId, 2),
    enabled: !!placeId,
    staleTime: 60_000, // 1 minute
    retry: 1, // Only retry once to avoid infinite loops
  });

  const { data: totalCount = 0 } = useQuery<number>({
    queryKey: ['contacts-count', placeId],
    queryFn: () => countContacts(placeId),
    enabled: !!placeId,
    staleTime: 60_000, // 1 minute
    retry: 1, // Only retry once to avoid infinite loops
  });

  const formatContactName = (contact: LeadContact): string => {
    if (contact.full_name) return contact.full_name;
    if (contact.first_name || contact.last_name) {
      return [contact.first_name, contact.last_name].filter(Boolean).join(' ');
    }
    return 'Unknown';
  };

  const formatContactChip = (contact: LeadContact): string => {
    const name = formatContactName(contact);
    const title = contact.title;
    return title ? `${name} — ${title}` : name;
  };

  const remainingCount = Math.max(0, totalCount - contacts.length);

  // Memoize chips list by place_id for performance - MUST be called before any early returns
  const contactChips = useMemo(() => {
    if (!placeId || contacts.length === 0) return null;
    
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {contacts.slice(0, 2).map((contact, index) => (
          <Badge
            key={`${placeId}-${index}`}
            variant="secondary"
            className="text-xs max-w-[120px] cursor-pointer hover:bg-secondary/80 transition-colors"
            onClick={onViewContacts}
            title={formatContactChip(contact)}
          >
            <span className="truncate">{formatContactChip(contact)}</span>
          </Badge>
        ))}
        
        {remainingCount > 0 && (
          <Badge
            variant="outline"
            className="text-xs cursor-pointer hover:bg-muted transition-colors"
            onClick={onViewContacts}
            title={`${remainingCount} more contact${remainingCount !== 1 ? 's' : ''}`}
          >
            +{remainingCount}
          </Badge>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-muted-foreground ml-1"
          onClick={onViewContacts}
        >
          View all
        </Button>
      </div>
    );
  }, [placeId, contacts, remainingCount, onViewContacts]);

  // Now we can do early returns after all hooks are called
  if (isLoading && placeId) {
    return (
      <div className="flex items-center gap-1">
        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
        <div className="h-5 w-12 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!placeId || (!isLoading && contacts.length === 0)) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-muted-foreground"
        onClick={onViewContacts}
      >
        <Users className="h-3 w-3 mr-1" />
        View contacts
      </Button>
    );
  }

  return contactChips;
}
