import type { Database } from '@/types/supabase';

export type ExcludedDomainData = Database['public']['Tables']['excluded_domains']['Row'];
