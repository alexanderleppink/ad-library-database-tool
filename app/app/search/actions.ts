'use server';

import type { SearchConfig } from '@/app/app/search/search.types';
import { format } from 'date-fns';
import { mutable } from '@/utils/typeUtils';

import type { QueryResult, ResultField } from '@/app/app/(ad-query)/adQuery.types';
import { pageSize } from '@/app/app/(ad-query)/adQuery.types';

const fields = mutable([
  'ad_creative_link_captions',
  'ad_delivery_start_time',
  'ad_snapshot_url',
  'eu_total_reach',
  'id'
] as const satisfies ResultField[]);

export type SearchQueryResults = QueryResult<(typeof fields)[number]>;
export type SearchQueryResultData = SearchQueryResults['data'][number];

export async function searchAds(searchConfig: SearchConfig): Promise<SearchQueryResults> {
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

function buildSearchQuery(searchConfig: SearchConfig): Record<string, string> {
  return {
    search_terms: searchConfig.searchTerms,
    ad_reached_countries: JSON.stringify(searchConfig.countries),
    languages: JSON.stringify(searchConfig.languages),
    ad_active_status: searchConfig.status,
    fields: fields.join(', '),
    limit:
      !searchConfig.maxResults || pageSize < searchConfig.maxResults
        ? pageSize.toString()
        : searchConfig.maxResults.toString(),
    ...(searchConfig.deliveryDateEnd
      ? { ad_delivery_date_max: format(searchConfig.deliveryDateEnd, 'yyyy-MM-dd') }
      : {}),
    ...(searchConfig.deliveryDateStart
      ? { ad_delivery_date_min: format(searchConfig.deliveryDateStart, 'yyyy-MM-dd') }
      : {})
  };
}
