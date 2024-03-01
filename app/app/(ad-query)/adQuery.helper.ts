import type { QueryResult } from '@/app/app/(ad-query)/adQuery.types';
import { pageSize } from '@/app/app/(ad-query)/adQuery.types';

export function queryAllPages<Q extends object, R extends QueryResult<any>>(
  queryFn: (params: Q) => Promise<R>
) {
  return async (searchQuery: Q, { totalLimit }: Partial<{ totalLimit: number }> = {}) => {
    const allResults: R['data'] = [];
    let next: string | undefined;
    for (let page = 0; true; page++) {
      const { paging, data } = next
        ? await fetch(next).then((response) => response.json())
        : await queryFn(searchQuery);
      allResults.push(...data);
      if (data.length < pageSize || (totalLimit && allResults.length >= totalLimit)) {
        break;
      }
      next = paging.next;
    }
    return allResults;
  };
}
