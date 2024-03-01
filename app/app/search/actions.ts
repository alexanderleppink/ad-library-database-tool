'use server';

import type { SearchConfig } from '@/app/app/search/search.types';
import { format } from 'date-fns';
import { mutable } from '@/utils/typeUtils';

import type { QueryResult, ResultField } from '@/app/app/(ad-query)/adQuery.types';
import { pageSize } from '@/app/app/(ad-query)/adQuery.types';
import { queryAllPages } from '@/app/app/(ad-query)/adQuery.helper';

const fields = mutable([
  'id',
  'ad_creative_link_captions',
  'ad_delivery_start_time',
  'ad_snapshot_url',
  'eu_total_reach'
] as const satisfies ResultField[]);

async function _searchAds(
  searchConfig: SearchConfig
): Promise<QueryResult<(typeof fields)[number]>> {
  const queryParams = new URLSearchParams({
    ...buildSearchQuery(searchConfig),
    access_token: process.env.META_USER_ACCESS_TOKEN
  });

  const requestOptions = {
    method: 'GET'
  };

  return fetch(
    `https://graph.facebook.com/ads_archive?${queryParams.toString()}`,
    requestOptions
  ).then((response) => response.json());
}

export const searchAds = queryAllPages(_searchAds);

function buildSearchQuery(searchConfig: SearchConfig): Record<string, string> {
  return {
    search_terms: searchConfig.searchTerms,
    ad_reached_countries: JSON.stringify(searchConfig.countries),
    languages: JSON.stringify(searchConfig.languages),
    ad_active_status: searchConfig.status,
    fields: fields.join(', '),
    limit: pageSize.toString(),
    ...(searchConfig.deliveryDateEnd
      ? { ad_delivery_date_max: format(searchConfig.deliveryDateEnd, 'yyyy-MM-dd') }
      : {}),
    ...(searchConfig.deliveryDateStart
      ? { ad_delivery_date_min: format(searchConfig.deliveryDateStart, 'yyyy-MM-dd') }
      : {})
  };
}
