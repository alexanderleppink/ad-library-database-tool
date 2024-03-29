import { fetchMediaData } from '@/app/app/(ad-query)/actions';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import type { PropsWithChildren } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import ContainerWithVisibilityObserver from '@/components/ContainerWithVisibilityObserver';

export type MediaData = Awaited<ReturnType<typeof fetchMediaData>>[number];

const clusterFetchInterval = 20;
const clusterSize = 30;

export function useFetchMedia() {
  const [mediaData, setMediaData] = useState<MediaData[]>([]);

  const mediaDataMap = useMemo(
    () => new Map(mediaData.map((data) => [data.id, data])),
    [mediaData]
  );

  const currentFetching = useRef(new Set<string>([]));

  const fetchMedia = useCallback(
    async (cluster: QueryResultData[]) => {
      const cleanedCluster = cluster.filter(
        ({ id }) => !currentFetching.current.has(id) && !mediaDataMap.has(id)
      );

      if (!cleanedCluster.length) {
        return;
      }

      cleanedCluster.forEach(({ id }) => currentFetching.current.add(id));

      const result = await fetchMediaData(cleanedCluster);

      setMediaData((prev) => [...prev, ...result]);
      cleanedCluster.forEach(({ id }) => currentFetching.current.delete(id));
    },
    [mediaDataMap]
  );

  return {
    mediaDataMap,
    fetchMedia
  };
}

export function FetchMediaClusterItem<T>({
  index,
  children,
  allData,
  onEnterView
}: PropsWithChildren<{
  index: number;
  allData: T[];
  onEnterView: (cluster: T[]) => unknown;
}>) {
  if (index % clusterFetchInterval === 0) {
    const cluster = allData.slice(index, index + clusterSize);
    return (
      <ContainerWithVisibilityObserver
        onVisible={() => {
          console.info('Starting to fetch for cluster page', index / clusterFetchInterval);
          return onEnterView(cluster);
        }}
      >
        {children}
      </ContainerWithVisibilityObserver>
    );
  }

  return <>{children}</>;
}
