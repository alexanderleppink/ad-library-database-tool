import React, { useMemo } from 'react';
import { Alert, Spinner } from 'flowbite-react';
import { useViewedAds } from '@/app/app/(ad-query)/useViewedAds';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import SearchResultCards from '@/app/app/(ad-query)/SearchResultCards';
import { useFetchMedia } from '@/app/app/(ad-query)/useFetchMedia';
import { useSortController } from '@/app/app/(ad-query)/useSortController';

function SearchResults({
  queryResultData,
  isLoading,
  error
}: {
  error?: string;
  queryResultData: QueryResultData[] | undefined;
  isLoading?: boolean;
}) {
  const resultsWithDomain = useMemo(() => {
    return queryResultData
      ?.filter(({ ad_creative_link_captions }) => ad_creative_link_captions?.length)
      .map((result) => ({
        ...result,
        domain: result.ad_creative_link_captions?.[0].replace(/https?:\/\//, '') || ''
      }));
  }, [queryResultData]);

  const { sortController, sortedData } = useSortController(resultsWithDomain);

  const viewedAdsData = useViewedAds(sortedData);
  const { data: mediaData } = useFetchMedia(sortedData);

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

  if (!queryResultData || !sortedData) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold my-2">Search results</h3>

      {sortController}

      <div className="flex items-center justify-between">
        <div>
          Found <span className="font-bold text-green-700">{sortedData.length}</span> results (
          <b>{queryResultData.length}</b> before filtering)
        </div>

        {viewedAdsData.isLoading ? (
          <div className="flex items-center space-x-2">
            <Spinner aria-label="loading" />
            <span>Loading viewed ads...</span>
          </div>
        ) : viewedAdsData.error ? (
          <Alert color="failure">Failed to load viewed ads!</Alert>
        ) : null}
      </div>

      {!!sortedData.length ? (
        <SearchResultCards
          mediaDataMap={mediaData}
          searchResults={sortedData}
          viewedAdsData={viewedAdsData}
        />
      ) : (
        <div className="flex justify-center text-center p-4">No results found</div>
      )}
    </div>
  );
}

export default SearchResults;
