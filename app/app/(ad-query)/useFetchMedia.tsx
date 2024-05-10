import { fetchMediaData } from '@/app/app/(ad-query)/actions';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import type { PropsWithChildren } from 'react';
import { useMemo, useRef, useState } from 'react';
import ContainerWithVisibilityObserver from '@/components/ContainerWithVisibilityObserver';

export type MediaData = Awaited<ReturnType<typeof fetchMediaData>>[number];

const clusterFetchInterval = 20;
export const clusterSize = 30;

export function useFetchMedia() {
  const [mediaData, setMediaData] = useState<MediaData[]>([]);

  const mediaDataMapRef = useRef(new Map<string, MediaData>());
  const mediaDataMap = useMemo(() => {
    const map = new Map(mediaData.map((data) => [data.id, data]));
    mediaDataMapRef.current = map;
    return map;
  }, [mediaData]);

  const currentFetching = useRef(new Set<string>([]));
  const [isFetching, setIsFetching] = useState(false);

  const fetchMedia = async (cluster: QueryResultData[]) => {
    const cleanedCluster = cluster.filter(
      ({ id }) => !currentFetching.current.has(id) && !mediaDataMapRef.current.has(id)
    );

    if (!cleanedCluster.length) {
      return;
    }

    console.info(`Fetching media for ${cleanedCluster.length} ads`);
    setIsFetching(true);
    cleanedCluster.forEach(({ id }) => currentFetching.current.add(id));

    const result = await fetchMediaData(cleanedCluster);

    setMediaData((prev) => [...prev, ...result]);
    cleanedCluster.forEach(({ id }) => currentFetching.current.delete(id));
    console.log('currentFetching.current.size', currentFetching.current);
    setIsFetching(!!currentFetching.current.size);
  };

  return {
    isFetching,
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
