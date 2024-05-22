import useSWR from 'swr';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import { useMemo } from 'react';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import { useUser } from '@supabase/auth-helpers-react';
import { groupBy, sortBy } from 'lodash-es';
import { v4 } from 'uuid';
import { toZonedTime } from 'date-fns-tz';
import { formatISO } from 'date-fns';

export function useSelectedAdRows(searchResults: QueryResultData[] | undefined) {
  // sort to ensure consistent query key
  const adIds = useMemo(
    () => (searchResults ? sortBy(searchResults.map((result) => result.id)) : null),
    [searchResults]
  );
  const supabase = createClientComponentClient<Database>();
  const user = useUser();
  const { data: supabaseReponse, ...response } = useSWR(
    adIds && user ? ['selectedAdRows', ...adIds] : null,
    async () =>
      await supabase
        .rpc('get_selected_ad_rows', { ad_ids: adIds!, user_id: user?.id! })
        .limit(100000)
  );

  const selectedAdRows = useMemo(
    () => groupBy(supabaseReponse?.data || [], ({ ad_id }) => ad_id),
    [supabaseReponse]
  );

  const addNew = async (adId: string, country: string, dateTime: Date) => {
    if (!user) {
      return;
    }

    const date = formatISO(toZonedTime(dateTime, 'UTC'), { representation: 'date' });
    const id = v4();
    await supabase
      .from('selected_ad_rows')
      .insert({ user_id: user.id, id, ad_id: adId, country, date });
    await response.mutate((prev) => {
      if (!prev?.data) {
        return undefined;
      }

      return {
        ...prev,
        data: [...prev.data, { ad_row_id: id, ad_id: adId, country, date }]
      };
    });
  };

  return {
    ...response,
    data: selectedAdRows,
    addNew
  };
}
