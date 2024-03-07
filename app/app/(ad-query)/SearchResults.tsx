import React, { useMemo } from 'react';
import type { SearchResultData } from '@/app/app/(ad-query)/SearchResultItem';
import { Alert, Spinner } from 'flowbite-react';
import SearchResultsTable from '@/app/app/(ad-query)/SearchResultsTable';

const reachThreshold = 25000;

function SearchResults({
  queryResultData,
  isLoading,
  error
}: {
  error?: string;
  queryResultData: SearchResultData[] | undefined;
  isLoading?: boolean;
}) {
  const filteredResults = useMemo(
    () =>
      queryResultData
        ?.filter((result) => result.eu_total_reach >= reachThreshold)
        .filter(({ ad_creative_link_captions }) => ad_creative_link_captions.length)
        .map((result) => ({
          ...result,
          domain: result.ad_creative_link_captions[0].replace(/https?:\/\//, '')
        })),
    [queryResultData]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="failure" className="mx-auto max-w-2xl">
        <div className="flex flex-col gap-2 items-center">
          <span>An error occurred while fetching the data</span>
          <span>{error}</span>
        </div>
      </Alert>
    );
  }

  if (!queryResultData || !filteredResults) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold my-2">Search results</h3>

      <div>
        Found <span className="font-bold text-green-700">{filteredResults.length}</span> results (
        <b>{queryResultData.length}</b> before filtering)
      </div>

      {!!filteredResults.length ? (
        <SearchResultsTable searchResults={filteredResults} />
      ) : (
        <div className="flex justify-center text-center p-4">No results found</div>
      )}
    </div>
  );
}

export default SearchResults;
