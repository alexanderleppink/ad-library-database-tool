import useSWR from 'swr';
import { fetchMediaData } from '@/app/app/(ad-query)/actions';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';

export type MediaData = Awaited<ReturnType<typeof fetchMediaData>>[number];

export function useQueryMedia(searchResultData: QueryResultData[] | undefined) {
  return useSWR(
    searchResultData ? ['queryMedia', ...searchResultData.map(({ id }) => id)] : null,
    async () => {
      const data = await clusterMediaQuery(searchResultData || [], fetchMediaData);
      return new Map(data?.map((media) => [media.id, media] as const));
    }
  );
}

type SnapshotData = Pick<QueryResultData, 'id' | 'ad_snapshot_url'>;

async function clusterMediaQuery(
  searchResultData: SnapshotData[],
  fetchFn: (cluster: SnapshotData[]) => Promise<MediaData[]>
) {
  const clusters = searchResultData.reduce((acc, item) => {
    const cluster = acc[acc.length - 1];
    if (cluster && cluster.length < 20) {
      cluster.push(item);
    } else {
      acc.push([item]);
    }
    return acc;
  }, [] as SnapshotData[][]);

  const results = await Promise.all(clusters.map(fetchFn));
  return results.flat();
}
