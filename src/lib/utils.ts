/**
 * Utility functions for the application
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility for combining CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a rating number to 1 decimal place
 */
export function formatRating(rating: number | null | undefined): string {
  if (!rating) return '0.0';
  return rating.toFixed(1);
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function relativeTime(dateString: string | null | undefined): string {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

/**
 * Get hostname from URL
 */
export function getHostname(url: string | null | undefined): string {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/**
 * Check if URL is a Google Maps link
 */
export function isMaps(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('maps.google.com') || url.includes('goo.gl/maps');
}