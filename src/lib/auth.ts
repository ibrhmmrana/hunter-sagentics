/**
 * Authentication utilities for Supabase
 */

import { supabase } from './supabase';

export async function getUserId(): Promise<string | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    
    return user?.id || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}
