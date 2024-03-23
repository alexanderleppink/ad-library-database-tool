import { fetchMediaData } from '@/app/app/(ad-query)/actions';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import useSWRInfinite from 'swr/infinite';

export type MediaData = Awaited<ReturnType<typeof fetchMediaData>>[number];

export function useFetchMedia(searchResultData: QueryResultData[] | undefined) {
  const getKey = (pageIndex: number) => {
    const clusterSize = 25;
    const cluster = searchResultData?.slice(
      pageIndex * clusterSize,
      pageIndex * clusterSize + clusterSize
    );
    if (!cluster?.length) {
      return null;
    }

    console.info('fetch media page', pageIndex);

    return [
      'queryMedia',
      ...cluster.map(({ id, ad_snapshot_url }) => ({ id, ad_snapshot_url }))
    ] as const;
  };

  const { data, ...response } = useSWRInfinite(
    getKey,
    async ([, ...cluster]) => fetchMediaData(cluster),
    { initialSize: 1000, parallel: true }
  );

  return {
    ...response,
    data: new Map(data?.flat().map((mediaData, index) => [searchResultData![index].id, mediaData]))
  };
}
