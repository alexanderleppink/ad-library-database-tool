import React from 'react';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import { Card } from 'flowbite-react';
import Link from 'next/link';

export type SearchResultData = Pick<
  QueryResultData,
  'ad_creative_link_captions' | 'ad_delivery_start_time' | 'eu_total_reach' | 'ad_snapshot_url'
>;

function SearchResultItem({ queryResultData }: { queryResultData: SearchResultData }) {
  const domain = '';
  return (
    <Card>
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
          Started: {queryResultData.ad_delivery_start_time}
        </div>
      </div>

      <div className="font-medium">
        Reach: <b>{queryResultData.eu_total_reach}</b>
      </div>

      <Link
        href={queryResultData.ad_snapshot_url}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-blue-600 hover:underline"
      >
        Open ad snapshot
      </Link>
    </Card>
  );
}

export default SearchResultItem;
