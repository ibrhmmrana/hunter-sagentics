/**
 * List types for Supabase lists functionality
 */

export interface List {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
}

export interface ListWithCount extends List {
  items_count: number;
}

export interface ListLeadsResult {
  rows: import('./lead').Lead[];
  total: number;
  page: number;
  pageSize: number;
}
