'use server';

import type { QueryResult, ResultField } from '@/app/app/(ad-query)/adQuery.types';
import { pageSize } from '@/app/app/(ad-query)/adQuery.types';

export async function queryAllPages<T extends ResultField>(
  queryFn: () => Promise<QueryResult<T>>,
  { totalLimit }: Partial<{ totalLimit: number }> = {}
): Promise<QueryResult<T>['data']> {
  const allResults: QueryResult<T>['data'] = [];
  let next: string | undefined;
  for (let page = 0; true; page++) {
    const { paging, data } = next
      ? await fetch(next).then((response) => response.json())
      : await queryFn();
    allResults.push(...data);
    if (data.length < pageSize || (totalLimit && allResults.length >= totalLimit)) {
      break;
    }
    next = paging.next;
  }
  return allResults;
}
