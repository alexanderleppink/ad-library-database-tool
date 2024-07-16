import type { Database } from '@/types/supabase';

export type ExcludedDomainData = Database['public']['Tables']['excluded_domains']['Row'];

export type GetSelectedAdRowsReturns =
  Database['public']['Functions']['get_selected_ad_rows']['Returns'];

export type SelectedAdRowData = Database['public']['Tables']['selected_ad_rows']['Row'];
export type SelectedAdRowUpsert = Omit<SelectedAdRowData, 'created_at' | 'user_id'>;
