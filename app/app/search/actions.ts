'use server';

import type { SearchConfig } from '@/app/app/search/search.types';

export function searchAds(searchConfig: SearchConfig) {
  const queryParams = new URLSearchParams(buildSearchQuery(searchConfig));

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  };

  fetch(
    `https://graph.facebook.com/ads_archive?${queryParams.toString()}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function buildSearchQuery(searchConfig: SearchConfig) {
  return {};
}
