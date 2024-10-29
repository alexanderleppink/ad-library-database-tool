import type { SearchConfig } from '@/app/app/search/search.types';
import { format } from 'date-fns';
import { mutable } from '@/utils/typeUtils';

import type { QueryResult, ResultField } from '@/app/app/(ad-query)/adQuery.types';
import { getMetaAccessToken } from '@/app/app/search/actions';

const fields = mutable([
  'ad_creative_link_captions',
  'ad_delivery_start_time',
  'ad_snapshot_url',
  'eu_total_reach',
  'ad_delivery_stop_time',
  'id'
] as const satisfies ResultField[]);

export type SearchQueryResults = QueryResult<(typeof fields)[number]>;
export type SearchQueryResultData = SearchQueryResults['data'][number];

export async function buildSearchUrl(searchConfig: SearchConfig) {
  const queryParams = new URLSearchParams({
    ...buildSearchQuery(searchConfig),
    access_token: await getMetaAccessToken()
  });

  return `https://graph.facebook.com/v21.0/ads_archive?${queryParams.toString()}`;
}

function buildSearchQuery(searchConfig: SearchConfig): Record<string, string> {
  return {
    search_terms: searchConfig.searchTerms,
    ad_reached_countries: JSON.stringify(searchConfig.countries),
    ...(!searchConfig.allLanguages
      ? {
          languages: JSON.stringify(searchConfig.languages)
        }
      : {}),
    ad_active_status: searchConfig.status,
    fields: fields.join(', '),
    limit:
      searchConfig.pageSize < searchConfig.maxResults
        ? searchConfig.pageSize.toString()
        : searchConfig.maxResults.toString(),
    ...(searchConfig.deliveryDateEnd
      ? { ad_delivery_date_max: format(searchConfig.deliveryDateEnd, 'yyyy-MM-dd') }
      : {}),
    ...(searchConfig.deliveryDateStart
      ? { ad_delivery_date_min: format(searchConfig.deliveryDateStart, 'yyyy-MM-dd') }
      : {})
  };
}
