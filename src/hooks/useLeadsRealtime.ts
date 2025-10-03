/**
 * React hook for Supabase Realtime subscriptions on the leads table
 * 
 * Requirements:
 * - The leads table must have Realtime enabled in Supabase dashboard
 * - RLS policy must allow SELECT for authenticated users: 
 *   CREATE POLICY "Users can view their own leads" ON public.leads 
 *   FOR SELECT USING (auth.uid() = user_id);
 * - The leads table must have a user_id column that matches auth.uid()
 */

import { useEffect, useRef } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/lead';

export interface RealtimeChange {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  row: Lead;
}

export interface UseLeadsRealtimeOptions {
  onChange: (change: RealtimeChange) => void;
  enabled?: boolean;
}

export function useLeadsRealtime({ onChange, enabled = true }: UseLeadsRealtimeOptions) {
  const channelRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);

  // Keep the callback ref up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let mounted = true;

    const setupSubscription = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.log('No authenticated user for realtime subscription');
          return;
        }

        // Create realtime channel
        const channel = supabase
          .channel('leads-realtime')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'leads',
              filter: `user_id=eq.${user.id}`
            },
            (payload: RealtimePostgresChangesPayload<Lead>) => {
              if (!mounted) return;

              const rowData = (payload.new || payload.old) as Lead;
              if (!rowData) return;

              const change: RealtimeChange = {
                type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
                row: rowData
              };

              console.log('Realtime lead change:', change);
              onChangeRef.current(change);
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to leads realtime');
            } else if (status === 'CHANNEL_ERROR') {
              console.error('Failed to subscribe to leads realtime');
            }
          });

        channelRef.current = channel;
      } catch (error) {
        console.error('Error setting up realtime subscription:', error);
      }
    };

    setupSubscription();

    // Cleanup function
    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [enabled]);

  // Return unsubscribe function for manual cleanup if needed
  const unsubscribe = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  };

  return { unsubscribe };
}
