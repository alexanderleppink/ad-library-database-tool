import useSWR from 'swr';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import { useMemo, useState } from 'react';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import { useUser } from '@supabase/auth-helpers-react';
import { sortBy } from 'lodash-es';

export function useViewedAds(searchResults: QueryResultData[] | undefined) {
  const adIds = useMemo(
    () => (searchResults ? sortBy(searchResults.map((result) => result.id)) : null),
    [searchResults]
  );
  const supabase = createClientComponentClient<Database>();
  const user = useUser();
  const { data: supabaseReponse, ...response } = useSWR(
    adIds ? ['viewedAds', ...adIds] : null,
    async () => await supabase.rpc('ad_id_in', { ids: adIds || [] }).limit(100000)
  );

  const oldViewedAdsSet = useMemo(() => new Set(supabaseReponse?.data || []), [supabaseReponse]);
  const [newViewedAdsSet, setNewViewedAdsSet] = useState(new Set<string>());

  const combinedViewedAdsSet = useMemo(
    () => new Set([...oldViewedAdsSet, ...newViewedAdsSet]),
    [oldViewedAdsSet, newViewedAdsSet]
  );

  const addNewViewedAd = async (id: string) => {
    setNewViewedAdsSet((prev) => new Set([...prev, id]));
    await supabase.from('viewed_ads').insert({ user: user?.id, id });
  };

  return {
    ...response,
    viewedAds: combinedViewedAdsSet,
    addNewViewedAd
  };
}
