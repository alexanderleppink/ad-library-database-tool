import React, { memo, useState } from 'react';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import { Card, Spinner } from 'flowbite-react';
import Link from 'next/link';
import type { useViewedAds } from '@/app/app/(ad-query)/useViewedAds';
import { format } from 'date-fns';
import clsx from 'clsx';
import type { MediaData } from '@/app/app/(ad-query)/useFetchMedia';
import { FetchMediaClusterItem, useFetchMedia } from '@/app/app/(ad-query)/useFetchMedia';
import { EyeIcon, EyeSlashIcon, PhotoIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import { useExcludedDomains } from '@/contexts/ExcludedDomainsContext';

export interface SearchCardItemData extends QueryResultData {
  domain: string | undefined;
}

export interface SearchResultsCardsProps {
  viewedAdsData: ReturnType<typeof useViewedAds>;
  searchResults: SearchCardItemData[];
}

function SearchResultCards({
  searchResults,
  viewedAdsData: { viewedAds, addNewViewedAd }
}: SearchResultsCardsProps) {
  const { mediaDataMap, fetchMedia } = useFetchMedia();
  const { freshlyExcludedDomains } = useExcludedDomains();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-4">
      {searchResults.map((result, index) => (
        <FetchMediaClusterItem
          key={result.id}
          index={index}
          allData={searchResults}
          onEnterView={fetchMedia}
        >
          <SearchResultItem
            freshlyExcludedDomains={freshlyExcludedDomains}
            mediaDataMap={mediaDataMap}
            queryResultData={result}
            viewedAdsSet={viewedAds}
            onView={addNewViewedAd}
          />
        </FetchMediaClusterItem>
      ))}
    </div>
  );
}

function _SearchResultItem({
  queryResultData: { domain, id, ad_snapshot_url, ad_delivery_start_time, eu_total_reach },
  viewedAdsSet,
  onView,
  mediaDataMap,
  onDomainExclude,
  freshlyExcludedDomains
}: {
  freshlyExcludedDomains: Set<string>;
  queryResultData: SearchCardItemData;
  viewedAdsSet: Set<string>;
  onView?: (id: string) => unknown;
  onDomainExclude?: (id: string, exclude: boolean) => unknown;
  mediaDataMap: Map<string, MediaData> | undefined;
}) {
  return (
    <Card
      renderImage={() => (
        <div className="w-full h-48 shrink-0 flex justify-center items-center">
          <CardMedia mediaData={mediaDataMap?.get(id)} />
        </div>
      )}
      className={clsx({
        'bg-gray-200': viewedAdsSet.has(id)
      })}
    >
      <div className="flex flex-col gap-1">
        <h4 className="text-lg font-bold overflow-hidden whitespace-nowrap text-ellipsis flex gap-1">
          {domain ? (
            <>
              <Link target="_blank" rel="noreferrer" href={`https://${domain}`}>
                {domain}
              </Link>
              {freshlyExcludedDomains.has(domain) ? (
                <EyeIcon
                  className="w-5 h-5 text-gray-500 cursor-pointer"
                  onClick={() => onDomainExclude?.(domain, true)}
                />
              ) : (
                <EyeSlashIcon
                  className="w-5 h-5 text-gray-500 cursor-pointer"
                  onClick={() => onDomainExclude?.(domain, false)}
                />
              )}
            </>
          ) : (
            <span>No website linked</span>
          )}
        </h4>

        <div className="text-gray-500 text-sm">
          Started: {format(ad_delivery_start_time, 'MMM dd, yyyy')}
        </div>
      </div>

      <div className="font-medium">
        Reach: <b>{eu_total_reach}</b>
      </div>

      <a
        onMouseDown={() => onView?.(id)}
        href={ad_snapshot_url}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-blue-600 hover:underline"
      >
        Open ad snapshot
      </a>
    </Card>
  );
}

const SearchResultItem = memo(_SearchResultItem);

function _CardMedia({ mediaData }: { mediaData: MediaData | undefined }) {
  const [showVideo, setShowVideo] = useState(false);
  if (!mediaData) {
    return <Spinner className="w-8 h-8" />;
  }

  if (mediaData.videoUrl) {
    if (mediaData.imageUrl && !showVideo) {
      return (
        <div
          className="w-full h-full relative flex justify-center items-center cursor-pointer"
          onClick={() => setShowVideo(true)}
        >
          <img src={mediaData.imageUrl} className="w-full h-full object-contain" alt="card image" />
          <PlayCircleIcon className="w-10 h-10 absolute inset-auto bg-white rounded-full" />
        </div>
      );
    }

    return (
      <video className="w-full h-full object-contain" src={mediaData.videoUrl} controls autoPlay />
    );
  }

  if (mediaData.imageUrl) {
    return (
      <img className="w-full h-full object-contain" src={mediaData.imageUrl} alt="card image" />
    );
  }

  return (
    <div className="flex flex-col gap-1 items-center">
      <PhotoIcon className="w-8 h-8" />
      <span>No media found</span>
    </div>
  );
}

const CardMedia = memo(_CardMedia);

export default memo(SearchResultCards);
