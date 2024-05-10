import React, { memo, useState } from 'react';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import { Card, Spinner } from 'flowbite-react';
import type { useViewedAds } from '@/app/app/(ad-query)/useViewedAds';
import { format } from 'date-fns';
import clsx from 'clsx';
import type { MediaData, useFetchMedia } from '@/app/app/(ad-query)/useFetchMedia';
import { FetchMediaClusterItem } from '@/app/app/(ad-query)/useFetchMedia';
import { EyeSlashIcon, PhotoIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import { useExcludedDomains } from '@/contexts/ExcludedDomainsContext';
import { numberWithThousandSeparator } from '@/utils/utils';

export interface SearchCardItemData extends QueryResultData {
  domain: string | undefined;
}

export interface SearchResultsCardsProps {
  viewedAdsData: ReturnType<typeof useViewedAds>;
  searchResults: SearchCardItemData[];
  fetchMedia: ReturnType<typeof useFetchMedia>['fetchMedia'];
  mediaDataMap: Map<string, MediaData>;
}

function SearchResultCards({
  searchResults,
  fetchMedia,
  mediaDataMap,
  viewedAdsData: { viewedAds, addNewViewedAd }
}: SearchResultsCardsProps) {
  const { isDomainFreshlyExcluded, addExcludedDomain, removeExcludedDomain } = useExcludedDomains();

  if (!searchResults.length) {
    return <div className="flex justify-center text-center p-4">No results found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-4">
      {searchResults.map((result, index) => (
        <FetchMediaClusterItem
          key={`${result.id}-${index}`}
          index={index}
          allData={searchResults}
          onEnterView={fetchMedia}
        >
          <SearchResultItem
            onDomainExclude={(id, exclude) =>
              exclude ? addExcludedDomain(id) : removeExcludedDomain(id)
            }
            hasFreshlyExcludedDomain={!!result.domain && isDomainFreshlyExcluded(result.domain)}
            mediaData={mediaDataMap?.get(result.id)}
            queryResultData={result}
            isViewedAd={!!viewedAds?.has(result.id)}
            onView={addNewViewedAd}
          />
        </FetchMediaClusterItem>
      ))}
    </div>
  );
}

function _SearchResultItem({
  queryResultData: { domain, id, ad_snapshot_url, ad_delivery_start_time, eu_total_reach },
  isViewedAd,
  onView,
  mediaData,
  onDomainExclude,
  hasFreshlyExcludedDomain
}: {
  hasFreshlyExcludedDomain: boolean;
  queryResultData: SearchCardItemData;
  isViewedAd: boolean;
  onView?: (id: string) => unknown;
  onDomainExclude?: (id: string, exclude: boolean) => unknown;
  mediaData: MediaData | undefined;
}) {
  return (
    <div className="relative">
      {hasFreshlyExcludedDomain && domain && (
        <div
          className="cursor-pointer absolute inset-0 flex justify-center items-center z-10"
          onClick={() => onDomainExclude?.(domain, false)}
        >
          <EyeSlashIcon className="w-20 h-20 text-gray-700" />
        </div>
      )}

      <Card
        renderImage={() => (
          <div className="w-full h-48 shrink-0 flex justify-center items-center">
            <CardMedia mediaData={mediaData} />
          </div>
        )}
        className={clsx({
          'bg-gray-200': isViewedAd,
          'opacity-40': hasFreshlyExcludedDomain
        })}
      >
        <div className="flex flex-col gap-1">
          <h4 className="text-lg font-bold overflow-hidden whitespace-nowrap text-ellipsis flex gap-2 items-center">
            {domain ? (
              <>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://${domain}`}
                  className="shrink truncate hover:underline"
                >
                  {domain}
                </a>
                <EyeSlashIcon
                  className="w-5 h-5 text-gray-500 hover:text-blue-500 active:text-blue-700 cursor-pointer shrink-0"
                  onClick={() => onDomainExclude?.(domain, true)}
                />
              </>
            ) : (
              <span>No website linked</span>
            )}
          </h4>

          {mediaData?.linkUrl ? (
            <a
              target="_blank"
              rel="noreferrer"
              href={mediaData.linkUrl}
              className="overflow-hidden whitespace-nowrap text-ellipsis truncate hover:underline"
            >
              {mediaData.linkUrl.replace(/https?:\/\//, '')}
            </a>
          ) : (
            <div>Offer url loading...</div>
          )}

          <div className="text-gray-500 text-sm">
            Started: {format(ad_delivery_start_time, 'MMM dd, yyyy')}
          </div>
        </div>

        <div className="font-medium flex gap-4">
          <span>
            Reach: <b>{numberWithThousandSeparator(eu_total_reach)}</b>
          </span>
          <span>
            Spent: <b>{numberWithThousandSeparator(Math.round(eu_total_reach * 0.011))}€</b>
          </span>
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
    </div>
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

export default SearchResultCards;
