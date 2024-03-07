import { Table } from 'flowbite-react';
import React from 'react';
import type { SearchResultData } from '@/app/app/(ad-query)/SearchResultItem';
import Link from 'next/link';
import SortHeadCell from '@/components/SortHeadCell';
import { useSortColumns } from '@/hooks/useSortColumns';
import { format } from 'date-fns';
import type { Database } from '@/types/supabase';
import { useUser } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useViewedAds } from '@/app/app/(ad-query)/useViewedAds';
import clsx from 'clsx';

export interface SearchTableRow extends SearchResultData {
  domain: string | undefined;
}

export interface SearchResultsTableProps {
  searchResults: SearchTableRow[];
}

function SearchResultsTable({ searchResults }: SearchResultsTableProps) {
  const { sortedArray, handlers } = useSortColumns(searchResults, {
    domain: (item) => item.domain || '',
    reach: (item) => item.eu_total_reach,
    startDate: (item) => item.ad_delivery_start_time
  });

  const { viewedAds, addNewViewedAd } = useViewedAds(searchResults);

  const user = useUser();
  const supabase = createClientComponentClient<Database>();
  const handleView = async (id: string) => {
    addNewViewedAd(id);
    await supabase.from('viewed_ads').insert({ user: user?.id, id });
  };

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
          <TableRow viewedAdsSet={viewedAds} key={index} rowData={result} onView={handleView} />
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
          <Link target="_blank" rel="noreferrer" href={`https://${domain}`}>
            {domain}
          </Link>
        ) : (
          <span>No website linked</span>
        )}
      </Table.Cell>
      <Table.Cell>{format(ad_delivery_start_time, 'MMM dd, yyyy')}</Table.Cell>
      <Table.Cell className="font-semibold">{eu_total_reach}</Table.Cell>
      <Table.Cell>
        <Link
          onMouseDown={() => onView(id)}
          href={ad_snapshot_url}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue-600 hover:underline"
        >
          Open ad snapshot
        </Link>
      </Table.Cell>
    </Table.Row>
  );
}

export default SearchResultsTable;
