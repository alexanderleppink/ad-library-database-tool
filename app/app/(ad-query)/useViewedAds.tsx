import type { SearchResultData } from '@/app/app/(ad-query)/SearchResultItem';
import useSWR from 'swr';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import { useMemo, useState } from 'react';

export function useViewedAds(searchResults: SearchResultData[] | undefined) {
  const adIds = searchResults ? searchResults.map((result) => result.id) : null;
  const supabase = createClientComponentClient<Database>();
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

  const addNewViewedAd = (id: string) => {
    setNewViewedAdsSet((prev) => new Set([...prev, id]));
  };

  return {
    ...response,
    viewedAds: combinedViewedAdsSet,
    addNewViewedAd
  };
}
