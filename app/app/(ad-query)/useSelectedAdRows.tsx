import useSWR from 'swr';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import { useMemo } from 'react';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import { useUser } from '@supabase/auth-helpers-react';
import { groupBy, sortBy } from 'lodash-es';
import type { SelectedAdRowUpsert } from '@/types/supabaseHelper.types';

export function useSelectedAdRows(searchResults: QueryResultData[] | undefined) {
  // sort to ensure consistent query key
  const adIds = useMemo(
    () => (searchResults ? sortBy(searchResults.map((result) => result.id)) : null),
    [searchResults]
  );
  const supabase = createClientComponentClient<Database>();
  const user = useUser();
  const { data: supabaseReponse, ...response } = useSWR(
    adIds?.length && user ? ['selectedAdRows', ...adIds] : null,
    async () =>
      await supabase
        .rpc('get_selected_ad_rows', { ad_ids: adIds!, user_id: user?.id! })
        .limit(100000)
  );

  const selectedAdRows = useMemo(
    () => groupBy(supabaseReponse?.data || [], ({ ad_id }) => ad_id),
    [supabaseReponse]
  );

  const upsertRow = async (data: SelectedAdRowUpsert) => {
    if (!user) {
      return;
    }

    await supabase.from('selected_ad_rows').upsert({ ...data, user_id: user.id });
    await response.mutate((prev) => {
      if (!prev?.data) {
        return undefined;
      }

      return {
        ...prev,
        data: [
          ...prev.data.filter(({ ad_row_id }) => ad_row_id !== data.id),
          { ad_row_id: data.id, ad_id: data.ad_id, country: data.country, date: data.date }
        ]
      };
    });
  };

  const deleteRow = async (adRowId: string) => {
    await supabase.from('selected_ad_rows').delete().eq('id', adRowId);
    await response.mutate((prev) => {
      if (!prev?.data) {
        return undefined;
      }

      return {
        ...prev,
        data: prev.data.filter((row) => row.ad_row_id !== adRowId)
      };
    });
  };

  return {
    ...response,
    data: selectedAdRows,
    upsertRow,
    deleteRow
  };
}
