import { Table } from 'flowbite-react';
import React from 'react';
import type { SearchResultData } from '@/app/app/(ad-query)/SearchResultItem';
import Link from 'next/link';

interface SearchResultsTableProps {
  searchResults: SearchResultData[];
}

function SearchResultsTable({ searchResults }: SearchResultsTableProps) {
  return (
    <Table striped>
      <Table.Head>
        <Table.HeadCell>Domain</Table.HeadCell>
        <Table.HeadCell>Start Date</Table.HeadCell>
        <Table.HeadCell>Reach</Table.HeadCell>
        <Table.HeadCell>Ad Snapshot</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {searchResults.map((result, index) => (
          <TableRow key={index} rowData={result} />
        ))}
      </Table.Body>
    </Table>
  );
}

function TableRow({
  rowData: { ad_creative_link_captions, ad_delivery_start_time, eu_total_reach, ad_snapshot_url }
}: {
  rowData: SearchResultData;
}) {
  const domain = ad_creative_link_captions[0].replace(/https?:\/\//, '');
  return (
    <Table.Row>
      <Table.Cell>
        {' '}
        {domain ? (
          <Link target="_blank" rel="noreferrer" href={`https://${domain}`}>
            {domain}
          </Link>
        ) : (
          <span>No website linked</span>
        )}
      </Table.Cell>
      <Table.Cell>{ad_delivery_start_time}</Table.Cell>
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
