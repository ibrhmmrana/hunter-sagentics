/**
 * Lead data types matching Supabase leads table schema
 * Includes all columns with proper nullable types
 */

export interface Lead {
  query_id?: string | null;
  place_id: string;
  title: string | null;
  category: string | null;
  address: string | null;
  city: string | null;
  country_code: string | null;
  phone: string | null;
  phone_normalized: string | null;
  url: string | null;
  website: string | null;
  image_url: string | null;
  rating: number | null;
  review_count: number | null;
  lat: number | null;
  lng: number | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null;
  youtube: string | null;
  tiktok: string | null;
  pinterest: string | null;
  discord: string | null;
  created_at?: string;
  contacted?: boolean;
}

/**
 * Column selection string for Supabase queries
 * Includes all Lead interface fields
 */
export const LeadSelect = 'query_id,place_id,title,category,address,city,country_code,phone,phone_normalized,url,website,image_url,rating,review_count,lat,lng,facebook,instagram,linkedin,twitter,youtube,tiktok,pinterest,discord,created_at,contacted';
