import type { QueryResult } from '@/app/app/(ad-query)/adQuery.types';
import { pageSize } from '@/app/app/(ad-query)/adQuery.types';

export function queryAllPages<Q extends object, R extends QueryResult<any>>(
  queryFn: (params: Q) => Promise<R>
) {
  return async (searchQuery: Q, { totalLimit }: Partial<{ totalLimit: number }> = {}) => {
    let allResults: R['data'] = [];
    let next: string | undefined;
    for (let page = 0; true; page++) {
      const fetchResult = next
        ? await fetch(next).then((response) => response.json() as Promise<R>)
        : await queryFn(searchQuery);
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
