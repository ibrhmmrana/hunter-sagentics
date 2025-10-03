/**
 * Live-updating relative time component
 * Updates every 45 seconds to keep timestamps fresh
 */

import { useEffect, useMemo, useState } from 'react';
import { formatTimeAgo } from '@/lib/time';

interface Props {
  iso?: string | null;
  className?: string;
  titlePrefix?: string; // e.g., "Created"
}

export default function TimeAgo({ iso, className, titlePrefix }: Props) {
  const [nowTick, setNowTick] = useState(0);
  
  const title = useMemo(() => {
    if (!iso) return undefined;
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return undefined;
      return `${titlePrefix ? titlePrefix + ': ' : ''}${d.toLocaleString()}`;
    } catch (e) {
      return undefined;
    }
  }, [iso, titlePrefix]);

  useEffect(() => {
    // Update every 45s so it stays fresh without being heavy
    const id = setInterval(() => setNowTick((n) => n + 1), 45_000);
    return () => clearInterval(id);
  }, []);

  // use nowTick to recompute - this will trigger re-render when nowTick changes
  const label = useMemo(() => {
    return formatTimeAgo(iso);
  }, [iso, nowTick]);
  
  return <span className={className} title={title}>{label}</span>;
}
