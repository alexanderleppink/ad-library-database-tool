import { Table } from 'flowbite-react';
import React from 'react';
import type { SearchResultData } from '@/app/app/(ad-query)/SearchResultItem';
import Link from 'next/link';
import SortHeadCell from '@/components/SortHeadCell';
import { useSortColumns } from '@/hooks/useSortColumns';
import { format } from 'date-fns';

interface SearchTableRow extends SearchResultData {
  domain: string | undefined;
}

interface SearchResultsTableProps {
  searchResults: SearchTableRow[];
}

function SearchResultsTable({ searchResults }: SearchResultsTableProps) {
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
          <TableRow key={index} rowData={result} />
        ))}
      </Table.Body>
    </Table>
  );
}

function TableRow({
  rowData: { ad_delivery_start_time, eu_total_reach, ad_snapshot_url, domain }
}: {
  rowData: SearchTableRow;
}) {
  return (
    <Table.Row>
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
