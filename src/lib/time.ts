/**
 * Time utilities for relative timestamps
 */

export function formatTimeAgo(iso?: string | null): string {
  if (!iso) return '—';
  
  // Handle different date formats
  let date: Date;
  try {
    date = new Date(iso);
  } catch (e) {
    console.warn('Invalid date format:', iso);
    return '—';
  }
  
  const then = date.getTime();
  if (Number.isNaN(then)) {
    console.warn('Invalid date value:', iso);
    return '—';
  }
  
  const now = Date.now();
  const s = Math.max(0, Math.floor((now - then) / 1000));
  
  
  if (s < 5) return 'Just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  const y = Math.floor(mo / 12);
  return `${y}y ago`;
}
