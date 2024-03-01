import React from 'react';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import SearchResultItem from '@/app/app/(ad-query)/SearchResultItem';

function SearchResults({ queryResultData }: { queryResultData: QueryResultData[] }) {
  return (
    <div>
      <h3 className="text-xl font-semibold my-4">Search results</h3>
      <div className="grid grid-cols-1 sm-grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {queryResultData.map((result) => (
          <SearchResultItem key={result.id} queryResultData={result} />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
