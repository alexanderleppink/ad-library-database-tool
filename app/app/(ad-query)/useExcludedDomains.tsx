import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import { useUser } from '@supabase/auth-helpers-react';
import useSWR from 'swr';
import { useEffect, useMemo, useState } from 'react';

export function useExcludedDomains(searchResults: unknown) {
  const supabase = createClientComponentClient<Database>();
  const user = useUser();

  const [freshlyExcludedDomains, setFreshlyExcludedDomains] = useState(new Set<string>());
  const [localExcludedDomains, setLocalExcludedDomains] = useState(new Set<string>());

  useEffect(() => {
    setLocalExcludedDomains(new Set([...localExcludedDomains, ...freshlyExcludedDomains]));
    setFreshlyExcludedDomains(new Set<string>());
  }, [searchResults]);

  const { data: supabaseReponse, ...response } = useSWR(
    ['excludedDomains'],
    async () => await supabase.from('excluded_domains').select('id').limit(100000)
  );

  const excludedDomains = useMemo(() => {
    return new Set([...localExcludedDomains, ...(supabaseReponse?.data || [])]);
  }, [supabaseReponse?.data, localExcludedDomains]);

  const addExcludedDomain = async (id: string) => {
    setFreshlyExcludedDomains((prev) => new Set([...prev, id]));
    await supabase.from('excluded_domains').insert({ user: user?.id, id });
  };

  const removeExcludedDomain = async (id: string) => {
    setFreshlyExcludedDomains((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    await supabase.from('excluded_domains').delete().eq('id', id);
  };

  return {
    ...response,
    excludedDomains,
    freshlyExcludedDomains,
    addExcludedDomain,
    removeExcludedDomain
  };
}
