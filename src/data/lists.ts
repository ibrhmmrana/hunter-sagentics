/**
 * Lists data access functions for Supabase
 * Handles list creation, management, and lead associations
 */

import { supabase } from '@/lib/supabase';
import { List, ListWithCount, ListLeadsResult } from '@/types/list';
import { Lead, LeadSelect } from '@/types/lead';

/**
 * Get current authenticated user ID
 */
export async function getCurrentUserId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
  
  if (!user) {
    throw new Error('No authenticated user');
  }
  
  return user.id;
}

/**
 * Create a new list
 */
export async function createList(name: string, description?: string): Promise<List> {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from('lists')
    .insert({
      name,
      description: description ?? null,
      user_id: userId,
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to create list: ${error.message}`);
  }
  
  return data;
}

/**
 * Get all lists for current user with item counts
 */
export async function listLists(): Promise<ListWithCount[]> {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from('lists')
    .select(`
      id,
      name,
      description,
      created_at,
      updated_at,
      is_archived,
      list_items(count)
    `)
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });
    
  if (error) {
    throw new Error(`Failed to fetch lists: ${error.message}`);
  }
  
  return data.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    created_at: row.created_at,
    updated_at: row.updated_at,
    is_archived: row.is_archived,
    items_count: row.list_items?.[0]?.count ?? 0,
  }));
}

/**
 * Delete a list
 */
export async function deleteList(listId: string): Promise<void> {
  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', listId);
    
  if (error) {
    throw new Error(`Failed to delete list: ${error.message}`);
  }
}

/**
 * Add leads to a list
 */
export async function addLeadsToList(listId: string, placeIds: string[]): Promise<number> {
  if (placeIds.length === 0) {
    return 0;
  }
  
  const items = placeIds.map(placeId => ({
    list_id: listId,
    place_id: placeId,
  }));
  
  const { data, error } = await supabase
    .from('list_items')
    .upsert(items, {
      onConflict: 'list_id,place_id',
    })
    .select();
    
  if (error) {
    throw new Error(`Failed to add leads to list: ${error.message}`);
  }
  
  return data?.length ?? placeIds.length;
}

/**
 * Get leads in a list with pagination
 */
export async function getListLeads(
  listId: string, 
  page = 1, 
  pageSize = 20
): Promise<ListLeadsResult> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data, error, count } = await supabase
    .from('list_items')
    .select(`
      place_id,
      leads:place_id (${LeadSelect})
    `, { count: 'exact' })
    .eq('list_id', listId)
    .range(from, to)
    .order('created_at', { ascending: false });
    
  if (error) {
    throw new Error(`Failed to fetch list leads: ${error.message}`);
  }
  
  const leads: Lead[] = data
    ?.map(item => item.leads)
    .filter(Boolean) ?? [];
    
  return {
    rows: leads,
    total: count ?? 0,
    page,
    pageSize,
  };
}

/**
 * Remove a lead from a list
 */
export async function removeFromList(listId: string, placeId: string): Promise<void> {
  const { error } = await supabase
    .from('list_items')
    .delete()
    .eq('list_id', listId)
    .eq('place_id', placeId);
    
  if (error) {
    throw new Error(`Failed to remove lead from list: ${error.message}`);
  }
}
