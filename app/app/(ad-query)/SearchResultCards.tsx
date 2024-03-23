import React from 'react';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import { Card } from 'flowbite-react';
import Link from 'next/link';
import type { useViewedAds } from '@/app/app/(ad-query)/useViewedAds';
import { format } from 'date-fns';
import clsx from 'clsx';

export interface SearchCardItemData extends QueryResultData {
  domain: string | undefined;
}

export interface SearchResultsCardsProps {
  viewedAdsData: ReturnType<typeof useViewedAds>;
  searchResults: SearchCardItemData[];
}

function SearchResultCards({
  searchResults,
  viewedAdsData: { viewedAds, addNewViewedAd }
}: SearchResultsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-4">
      {searchResults.map((result, index) => (
        <SearchResultItem
          key={index}
          queryResultData={result}
          viewedAdsSet={viewedAds}
          onView={addNewViewedAd}
        />
      ))}
    </div>
  );
}

function SearchResultItem({
  queryResultData: { domain, id, ad_snapshot_url, ad_delivery_start_time, eu_total_reach },
  viewedAdsSet,
  onView
}: {
  queryResultData: SearchCardItemData;
  viewedAdsSet: Set<string>;
  onView?: (id: string) => unknown;
}) {
  return (
    <Card
      className={clsx({
        'bg-gray-200': viewedAdsSet.has(id)
      })}
    >
      <div className="flex flex-col gap-1">
        <h4 className="text-lg font-bold overflow-hidden whitespace-nowrap text-ellipsis">
          {domain ? (
            <Link target="_blank" rel="noreferrer" href={`https://${domain}`}>
              {domain}
            </Link>
          ) : (
            <span>No website linked</span>
          )}
        </h4>

        <div className="text-gray-500 text-sm">
          Started: {format(ad_delivery_start_time, 'MMM dd, yyyy')}
        </div>
      </div>

      <div className="font-medium">
        Reach: <b>{eu_total_reach}</b>
      </div>

      <a
        onMouseDown={() => onView?.(id)}
        href={ad_snapshot_url}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-blue-600 hover:underline"
      >
        Open ad snapshot
      </a>
    </Card>
  );
}

export default SearchResultCards;
