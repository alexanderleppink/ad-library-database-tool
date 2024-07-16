import type { QueryResult } from '@/app/app/(ad-query)/adQuery.types';
import { replaceQueryParams } from '@/utils/utils';

export function queryAllPages(firstQueryUrl: string) {
  return async ({ totalLimit, pageSize }: { totalLimit: number; pageSize: number }) => {
    let allResults: QueryResult<any>['data'] = [];
    let next: string | undefined;
    for (let page = 0; true; page++) {
      const fetchResult: QueryResult<any> = await executeQuery(
        next ? next : firstQueryUrl,
        pageSize
      );
      if (!fetchResult.data) {
        const errorMessage = fetchResult.error?.message || 'No error message';
        console.error('Error during fetching data', errorMessage);
        throw new Error(errorMessage);
      }

      const { paging, data } = fetchResult;

      allResults = [...allResults, ...data];
      console.info(`fetched ${page} page`);
      if (data.length < pageSize || (totalLimit && allResults.length >= totalLimit)) {
        break;
      }
      next = paging.next;
    }
    return allResults;
  };
}

async function executeQuery(url: string, pageSize: number): Promise<QueryResult<any>> {
  let errorResponse = null;
  for (let i = 0; i < 3; i++) {
    const adjustedUrl =
      i === 0
        ? url
        : replaceQueryParams(url, { limit: Math.floor(pageSize / Math.pow(2, i)).toString() });
    const response = await fetch(adjustedUrl);

    if (response.status >= 400) {
      errorResponse = await response.json().catch(() => 'Unknown error');
      continue;
    }
    return await response.json();
  }

  console.error('Failed to fetch data after 3 attempts');
  return errorResponse;
}
