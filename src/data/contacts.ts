/**
 * Data access functions for lead contacts
 */

import { supabase } from '@/lib/supabase';
import { LeadContact } from '@/types/contact';
import { getEnv } from '@/config/env';

export async function listContactsForPlace(placeId: string, limit = 5): Promise<LeadContact[]> {
  if (!placeId) {
    console.warn('listContactsForPlace called without placeId');
    return [];
  }

  const { url, anon } = getEnv();
  if (!url || !anon) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('lead_contacts')
      .select('*')
      .eq('place_id', placeId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching contacts for place_id:', placeId, error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching contacts for place_id:', placeId, error);
    return [];
  }
}

export async function previewContactsForPlace(placeId: string, limit = 2): Promise<LeadContact[]> {
  if (!placeId) {
    console.warn('previewContactsForPlace called without placeId');
    return [];
  }
  
  return listContactsForPlace(placeId, limit);
}

export async function countContacts(placeId: string): Promise<number> {
  if (!placeId) {
    console.warn('countContacts called without placeId');
    return 0;
  }

  const { url, anon } = getEnv();
  if (!url || !anon) {
    return 0;
  }

  try {
    const { count, error } = await supabase
      .from('lead_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('place_id', placeId);

    if (error) {
      console.error('Error counting contacts for place_id:', placeId, error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error counting contacts for place_id:', placeId, error);
    return 0;
  }
}

// New function for the polished contacts experience
export async function listContactsByPlaceId(placeId: string, limit = 5): Promise<LeadContact[]> {
  if (!placeId) {
    console.warn('listContactsByPlaceId called without placeId');
    return [];
  }

  const { url, anon } = getEnv();
  if (!url || !anon) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('lead_contacts')
      .select('*')
      .eq('place_id', placeId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching contacts by place_id:', placeId, error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching contacts by place_id:', placeId, error);
    return [];
  }
}

// Legacy function - deprecated, use countContacts instead
export async function getContactsCount(placeId: string): Promise<number> {
  return countContacts(placeId);
}
