/**
 * Image utilities for reliable loading with proxy and fallbacks
 */

export function initials(name?: string | null): string {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('') || '?';
}

export function toProxyUrl(url?: string | null): string | null {
  if (!url) return null;
  
  try {
    const u = new URL(url);
    
    // Only proxy http/https URLs
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    
    // Avoid double-proxy
    if (u.hostname === 'images.weserv.nl') return null;
    
    // Strip protocol and create proxy URL
    const hostAndPath = url.replace(/^https?:\/\//, '');
    return `https://images.weserv.nl/?url=${encodeURIComponent(hostAndPath)}&w=256&h=256&fit=cover&we=1&il`;
  } catch {
    return null;
  }
}
