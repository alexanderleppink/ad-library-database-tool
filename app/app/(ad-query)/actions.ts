'use server';

import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import { facebookSnapshotRequest } from '@/app/app/(ad-query)/facebookSnapshotRequest';

export async function fetchMediaData(
  snapshotData: Pick<QueryResultData, 'id' | 'ad_snapshot_url'>[]
) {
  return Promise.all(
    snapshotData.map(async ({ id, ad_snapshot_url }) => {
      return {
        id,
        ...(await facebookSnapshotRequest(ad_snapshot_url)
          .then((response) => response.text())
          .then(extractMediaData))
      };
    })
  );
}

function extractMediaData(html: string) {
  function extractUrl(propertyName: string) {
    return html.match(new RegExp(`"${propertyName}":\s?"([^"]+)"`))?.[1]?.replaceAll(/\\\//g, '/');
  }

  const videoUrl = extractUrl('video_sd_url') || extractUrl('video_hd_url');
  if (videoUrl) {
    return { videoUrl, imageUrl: extractUrl('video_preview_image_url') || null };
  }

  const imageUrl = extractUrl('resized_image_url');
  return { imageUrl: imageUrl || null, videoUrl: null };
}
