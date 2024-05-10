import type { useFetchMedia } from '@/app/app/(ad-query)/useFetchMedia';
import { clusterSize } from '@/app/app/(ad-query)/useFetchMedia';
import type { SearchCardItemData } from '@/app/app/(ad-query)/SearchResultCards';
import { useEffect, useMemo } from 'react';
import { groupBy } from 'lodash-es';
import type { useSortController } from '@/app/app/(ad-query)/useSortController';

export function usePrefetchShopifyProducts(
  data: SearchCardItemData[],
  fetchMedia: ReturnType<typeof useFetchMedia>['fetchMedia'],
  mediaDataMap: ReturnType<typeof useFetchMedia>['mediaDataMap'],
  { productType }: ReturnType<typeof useSortController>['mediaFilters']
) {
  useEffect(() => {
    const groupedData = Object.values(
      groupBy(
        data.map((data, index) => ({
          data,
          index
        })),
        ({ index }) => Math.round(index / clusterSize)
      )
    ).map((data) => data.map(({ data }) => data));

    console.info(`Prefetch ${groupedData.length} groups of ads`);
    // synchronous because next.js doesn't support concurrent server actions
    Promise.resolve().then(async () => {
      for (const group of groupedData) {
        await fetchMedia(group);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return useMemo(() => {
    const filterProductType = ({ id }: SearchCardItemData) => {
      const mediaData = mediaDataMap.get(id);
      switch (productType) {
        case 'shopify':
          return !!mediaData?.linkUrl?.includes('/products/');
        case 'all':
          return true;
      }
    };
    return data.filter(filterProductType);
  }, [mediaDataMap, productType, data]);
}
