import React, { useEffect, useMemo } from 'react';
import { Alert, Spinner } from 'flowbite-react';
import { useViewedAds } from '@/app/app/(ad-query)/useViewedAds';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import SearchResultCards from '@/app/app/(ad-query)/SearchResultCards';
import { useSortController } from '@/app/app/(ad-query)/useSortController';
import { useExcludedDomains } from '@/contexts/ExcludedDomainsContext';
import { useFetchMedia } from '@/app/app/(ad-query)/useFetchMedia';
import { usePrefetchShopifyProducts } from '@/app/app/(ad-query)/usePrefetchShopifyProducts';
import { useSelectedAdRows } from '@/app/app/(ad-query)/useSelectedAdRows';

function SearchResults({
  queryResultData,
  isLoading,
  error
}: {
  error?: string;
  queryResultData: QueryResultData[] | undefined;
  isLoading?: boolean;
}) {
  const { isDomainExcluded, defreshExcludedDomains, ...excludedDomainsResponse } =
    useExcludedDomains();

  useEffect(() => {
    defreshExcludedDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryResultData]);

  const resultsWithDomain = useMemo(() => {
    return queryResultData
      ?.filter(({ ad_creative_link_captions }) => ad_creative_link_captions?.length)
      .map((result) => ({
        ...result,
        domain: result.ad_creative_link_captions?.[0].replace(/https?:\/\//, '') || ''
      }))
      .filter(({ domain }) => !isDomainExcluded(domain));
  }, [queryResultData, isDomainExcluded]);

  const { mediaDataMap, isFetching, fetchMedia } = useFetchMedia();

  const { sortController, sortedData, mediaFilters } = useSortController(
    resultsWithDomain,
    mediaDataMap
  );

  const viewedAdsData = useViewedAds(sortedData);
  const selectedAdRows = useSelectedAdRows(sortedData);

  const adjustedData = usePrefetchShopifyProducts(
    sortedData,
    fetchMedia,
    mediaDataMap,
    mediaFilters
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
          <span>You can try to reduce page size to prevent this</span>
        </div>
      </Alert>
    );
  }

  if (!queryResultData || !adjustedData) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold my-2">Search results</h3>

      {sortController}

      <div className="flex items-center justify-between">
        <div>
          Found <span className="font-bold text-green-700">{adjustedData.length}</span> results (
          <b>{queryResultData.length}</b> before filtering)
        </div>

        <div className="flex gap-2 items-center">
          {excludedDomainsResponse.isLoading ? (
            <div className="flex items-center space-x-2">
              <Spinner aria-label="loading" />
              <span>Loading excluded domains...</span>
            </div>
          ) : excludedDomainsResponse.error ? (
            <Alert color="failure">Failed to load excluded domains!</Alert>
          ) : null}
          {viewedAdsData.isLoading || selectedAdRows.isLoading ? (
            <div className="flex items-center space-x-2">
              <Spinner aria-label="loading" />
              <span>Loading viewed ads...</span>
            </div>
          ) : viewedAdsData.error || selectedAdRows.error ? (
            <Alert color="failure">Failed to load viewed ads!</Alert>
          ) : null}
        </div>
      </div>

      <SearchResultCards
        mediaDataMap={mediaDataMap}
        fetchMedia={fetchMedia}
        searchResults={adjustedData}
        viewedAdsData={viewedAdsData}
      />

      {isFetching && (
        <div className="flex flex-col p-8 items-center justify-center gap-8">
          <Spinner size="lg" />
          <span>Fetching offer urls & media...</span>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
