import type { QueryResult } from '@/app/app/(ad-query)/adQuery.types';
import { replaceQueryParams } from '@/utils/utils';

export function queryAllPages(firstQueryUrl: string) {
  return async ({ totalLimit, pageSize }: { totalLimit: number; pageSize: number }) => {
    let allResults: QueryResult<any>['data'] = [];
    let next: string | undefined;
    for (let page = 0; true; page++) {
      const { result, appliedPageSize } = await executeQuery(next ? next : firstQueryUrl, pageSize);
      if (!result.data) {
        const errorMessage = result.error?.message || 'No error message';
        console.error('Error during fetching data', errorMessage);
        throw new Error(errorMessage);
      }

      const { paging, data } = result;

      allResults = [...allResults, ...data];
      console.info(`fetched ${page} page`);
      if (
        data.length < (appliedPageSize ?? pageSize) ||
        (totalLimit && allResults.length >= totalLimit)
      ) {
        break;
      }
      next = paging.next;
    }
    return allResults;
  };
}

async function executeQuery(
  url: string,
  pageSize: number
): Promise<{
  appliedPageSize: number | null;
  result: QueryResult<any>;
}> {
  let errorResponse = null;
  for (let i = 0; i < 3; i++) {
    const adjustedUrl = replaceQueryParams(url, { limit: pageSize.toString() });
    const response = await fetch(adjustedUrl);

    if (response.status >= 400) {
      errorResponse = await response.json().catch(() => 'Unknown error');
      pageSize = Math.ceil(pageSize / 2);
      console.warn(`${i + 1}. attempt failed. Will try again or cancel.`);
      continue;
    }
    return {
      appliedPageSize: pageSize,
      result: await response.json()
    };
  }

  console.error('Failed to fetch data after 3 attempts');
  return {
    result: errorResponse,
    appliedPageSize: pageSize
  };
}
