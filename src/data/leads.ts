/**
 * Lead data access functions
 * Provides typed, paginated access to the leads table
 */

import { supabase } from '@/lib/supabase';
import { Lead, LeadSelect } from '@/types/lead';
import { getEnv } from '@/config/env';

export interface ListLeadsParams {
  q?: string;           // free-text search
  page?: number;        // 1-based page number
  pageSize?: number;    // results per page
  sort?: 'recent' | 'rating_desc' | 'rating_asc' | 'reviews_desc';
  website?: 'any' | 'none' | 'has';      // default 'any'
  socials?: 'any' | 'none' | 'has';      // default 'any'
  contacted?: 'any' | 'no' | 'yes';      // default 'any'
}

export interface ListLeadsResult {
  rows: Lead[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export async function listLeads(params: ListLeadsParams = {}): Promise<ListLeadsResult> {
  const { 
    q, 
    page = 1, 
    pageSize = 20, 
    sort = 'recent',
    website = 'any',
    socials = 'any',
    contacted = 'any'
  } = params;

  const { url, anon } = getEnv();
  if (!url || !anon) {
    return { rows: [], page, pageSize, total: 0, pageCount: 1 };
  }

  // Build base query - include all lead fields including contacted
  const safeSelect = 'query_id,place_id,title,category,address,city,country_code,phone,phone_normalized,url,website,image_url,rating,review_count,lat,lng,facebook,instagram,linkedin,twitter,youtube,tiktok,pinterest,discord,created_at,contacted';
  
  let query = supabase
    .from('leads')
    .select(safeSelect, { count: 'exact', head: false });

  // Apply text search filter
  if (q) {
    query = query.or(`title.ilike.%${q}%,category.ilike.%${q}%,city.ilike.%${q}%,address.ilike.%${q}%`);
  }

  // Apply website filter
  if (website === 'none') {
    query = query.is('website', null);
  } else if (website === 'has') {
    query = query.not('website', 'is', null);
  }

  // Apply socials filter
  if (socials === 'none') {
    query = query
      .is('facebook', null)
      .is('instagram', null)
      .is('linkedin', null)
      .is('twitter', null)
      .is('youtube', null)
      .is('tiktok', null)
      .is('pinterest', null)
      .is('discord', null);
  } else if (socials === 'has') {
    query = query.or('facebook.not.is.null,instagram.not.is.null,linkedin.not.is.null,twitter.not.is.null,youtube.not.is.null,tiktok.not.is.null,pinterest.not.is.null,discord.not.is.null');
  }

  // Apply contacted filter
  if (contacted === 'no') {
    query = query.eq('contacted', false);
  } else if (contacted === 'yes') {
    query = query.eq('contacted', true);
  }

  // Apply sorting
  switch (sort) {
    case 'recent':
      query = query.order('created_at', { ascending: false, nullsFirst: false });
      break;
    case 'rating_desc':
      query = query.order('rating', { ascending: false, nullsFirst: true });
      break;
    case 'rating_asc':
      query = query.order('rating', { ascending: true, nullsFirst: true });
      break;
    case 'reviews_desc':
      query = query.order('review_count', { ascending: false, nullsFirst: true });
      break;
  }

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  // Execute query
  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch leads: ${error.message}`);
  }

  // Add default contacted status for leads (since column might not exist yet)
  const leadsWithContacted = (data ?? []).map(lead => ({
    ...lead,
    contacted: lead.contacted ?? false
  }));

  return {
    rows: leadsWithContacted,
    page,
    pageSize,
    total: count ?? 0,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / pageSize))
  };
}

/**
 * Update the contacted status of a lead
 */
export async function updateLeadContacted(placeId: string, contacted: boolean): Promise<void> {
  const { url, anon } = getEnv();
  if (!url || !anon) {
    throw new Error('Supabase configuration missing');
  }

  try {
    const { error } = await supabase
      .from('leads')
      .update({ contacted })
      .eq('place_id', placeId);

    if (error) {
      // If the error is about the column not existing, provide a helpful message
      if (error.message.includes('contacted') && error.message.includes('does not exist')) {
        throw new Error('Contacted functionality requires a database migration. Please run the migration in Supabase dashboard.');
      }
      throw new Error(`Failed to update lead contacted status: ${error.message}`);
    }
  } catch (error) {
    console.error('Error updating contacted status:', error);
    throw error;
  }
}
