import React from 'react';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';

function SearchResultItem({ queryResultData }: { queryResultData: QueryResultData }) {
  return <div>{JSON.stringify(queryResultData)}</div>;
}

export default SearchResultItem;
