import { Table } from 'flowbite-react';
import React from 'react';
import SortHeadCell from '@/components/SortHeadCell';
import { useSortColumns } from '@/hooks/useSortColumns';
import { format } from 'date-fns';
import type { useViewedAds } from '@/app/app/(ad-query)/useViewedAds';
import clsx from 'clsx';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';

export interface SearchTableRow extends QueryResultData {
  domain: string | undefined;
}

export interface SearchResultsTableProps {
  viewedAdsData: ReturnType<typeof useViewedAds>;
  searchResults: SearchTableRow[];
}

function SearchResultsTable({
  searchResults,
  viewedAdsData: { viewedAds, addNewViewedAd }
}: SearchResultsTableProps) {
  const { sortedArray, handlers } = useSortColumns(searchResults, {
    domain: (item) => item.domain || '',
    reach: (item) => item.eu_total_reach,
    startDate: (item) => item.ad_delivery_start_time
  });

  return (
    <Table>
      <Table.Head>
        <SortHeadCell {...handlers.domain}>Domain</SortHeadCell>
        <SortHeadCell {...handlers.startDate}>Start Date</SortHeadCell>
        <SortHeadCell {...handlers.reach}>Reach</SortHeadCell>
        <Table.HeadCell>Ad Snapshot</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {sortedArray.map((result, index) => (
          <TableRow viewedAdsSet={viewedAds} key={index} rowData={result} onView={addNewViewedAd} />
        ))}
      </Table.Body>
    </Table>
  );
}

function TableRow({
  viewedAdsSet,
  onView,
  rowData: { ad_delivery_start_time, eu_total_reach, ad_snapshot_url, domain, id }
}: {
  viewedAdsSet: Set<string>;
  onView: (id: string) => unknown;
  rowData: SearchTableRow;
}) {
  return (
    <Table.Row
      className={clsx({
        'bg-gray-200': viewedAdsSet.has(id)
      })}
    >
      <Table.Cell>
        {domain ? (
          <a target="_blank" rel="noreferrer" href={`https://${domain}`}>
            {domain}
          </a>
        ) : (
          <span>No website linked</span>
        )}
      </Table.Cell>
      <Table.Cell>{format(ad_delivery_start_time, 'MMM dd, yyyy')}</Table.Cell>
      <Table.Cell className="font-semibold">{eu_total_reach}</Table.Cell>
      <Table.Cell>
        {!!ad_snapshot_url && (
          <a
            onMouseDown={() => onView(id)}
            href={ad_snapshot_url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            Open ad snapshot
          </a>
        )}
      </Table.Cell>
    </Table.Row>
  );
}

export default SearchResultsTable;
