/**
 * Simple contacts count badge for LeadCard
 */

import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { countContacts } from '@/data/contacts';

type Props = {
  placeId: string;
  onClick: () => void;
};

export default function ContactsCountBadge({ placeId, onClick }: Props) {
  const { data: count = 0, isLoading } = useQuery<number>({
    queryKey: ['contacts-count', placeId],
    queryFn: () => countContacts(placeId),
    enabled: !!placeId,
    staleTime: 60_000, // 1 minute
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="h-6 w-12 bg-muted rounded animate-pulse" />
    );
  }

  if (count === 0) {
    return (
      <Badge 
        variant="outline" 
        className="text-xs cursor-pointer hover:bg-muted transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <Users className="h-3 w-3 mr-1" />
        No contacts
      </Badge>
    );
  }

  return (
    <Badge 
      variant="secondary" 
      className="text-xs cursor-pointer hover:bg-secondary/80 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={`${count} contact${count !== 1 ? 's' : ''} available`}
    >
      <Users className="h-3 w-3 mr-1" />
      {count}
    </Badge>
  );
}
