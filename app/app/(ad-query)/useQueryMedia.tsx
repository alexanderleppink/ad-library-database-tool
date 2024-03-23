import type { SearchResultData } from '@/app/app/(ad-query)/SearchResultItem';
import useSWR from 'swr';
import { fetchMediaData } from '@/app/app/(ad-query)/actions';

export type MediaData = Awaited<ReturnType<typeof fetchMediaData>>[number];

export function useQueryMedia(searchResultData: SearchResultData[] | undefined) {
  return useSWR(
    searchResultData ? ['queryMedia', ...searchResultData.map(({ id }) => id)] : null,
    async () => {
      const data = await clusterMediaQuery(searchResultData || [], fetchMediaData);
      return new Map(data?.map((media) => [media.id, media] as const));
    }
  );
}

async function clusterMediaQuery(
  searchResultData: SearchResultData[],
  fetchFn: (cluster: SearchResultData[]) => Promise<MediaData[]>
) {
  const clusters = searchResultData.reduce((acc, item) => {
    const cluster = acc[acc.length - 1];
    if (cluster && cluster.length < 20) {
      cluster.push(item);
    } else {
      acc.push([item]);
    }
    return acc;
  }, [] as SearchResultData[][]);

  const results = await Promise.all(clusters.map(fetchFn));
  return results.flat();
}
