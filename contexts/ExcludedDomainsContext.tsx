import type { PropsWithChildren } from 'react';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import { useUser } from '@supabase/auth-helpers-react';
import useSWR from 'swr';

const ExcludedDomainsContext = createContext<
  ReturnType<typeof useExcludedDomainsInternal> | undefined
>(undefined);

export const ExcludedDomainsProvider = ({ children }: PropsWithChildren) => {
  const state = useExcludedDomainsInternal();
  return (
    <ExcludedDomainsContext.Provider value={state}>{children}</ExcludedDomainsContext.Provider>
  );
};

function extractTopLevelDomain(domain: string) {
  return domain.match(/^([^.]+\.)?([^.]+\.[^\/?]+)/)?.[2];
}

function useExcludedDomainsInternal() {
  const supabase = createClientComponentClient<Database>();
  const user = useUser();

  const [freshlyExcludedDomains, setFreshlyExcludedDomains] = useState(new Set<string>());
  const [localExcludedDomains, setLocalExcludedDomains] = useState(new Set<string>());

  const defreshExcludedDomains = useCallback(() => {
    if (freshlyExcludedDomains.size > 0) {
      setLocalExcludedDomains(new Set([...localExcludedDomains, ...freshlyExcludedDomains]));
      setFreshlyExcludedDomains(new Set<string>());
    }
  }, [freshlyExcludedDomains, localExcludedDomains]);

  const isDomainFreshlyExcluded = useCallback(
    (domain: string) => freshlyExcludedDomains.has(extractTopLevelDomain(domain) || domain),
    [freshlyExcludedDomains]
  );

  const { data: supabaseReponse, ...response } = useSWR(
    ['excludedDomains'],
    async () => await supabase.from('excluded_domains').select('id').limit(100000)
  );

  const excludedDomains = useMemo(() => {
    return new Set([
      ...localExcludedDomains,
      ...(supabaseReponse?.data?.map(({ id }) => id) || [])
    ]);
  }, [supabaseReponse?.data, localExcludedDomains]);

  const isDomainExcluded = useCallback(
    (domain: string) => excludedDomains.has(extractTopLevelDomain(domain) || domain),
    [excludedDomains]
  );

  const addExcludedDomain = useCallback(
    async (domain: string) => {
      const topLevelDomain = extractTopLevelDomain(domain) || domain;
      setFreshlyExcludedDomains((prev) => new Set([...prev, topLevelDomain]));
      await supabase.from('excluded_domains').insert({ user: user?.id, id: topLevelDomain });
    },
    [supabase, user?.id]
  );

  const removeExcludedDomain = useCallback(
    async (domain: string) => {
      const topLevelDomain = extractTopLevelDomain(domain) || domain;
      setFreshlyExcludedDomains((prev) => {
        const newSet = new Set(prev);
        newSet.delete(topLevelDomain);
        return newSet;
      });
      await supabase.from('excluded_domains').delete().eq('id', topLevelDomain);
    },
    [supabase]
  );

  return {
    ...response,
    isDomainFreshlyExcluded,
    isDomainExcluded,
    addExcludedDomain,
    removeExcludedDomain,
    defreshExcludedDomains
  };
}

export const useExcludedDomains = () => {
  const context = useContext(ExcludedDomainsContext);
  if (context === undefined) {
    throw new Error('useExcludedDomains must be used within a ExcludedDomainsProvider');
  }
  return context;
};

export default ExcludedDomainsContext;
