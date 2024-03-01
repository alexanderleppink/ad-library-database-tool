import React from 'react';
import SearchForm from '@/app/app/search/SearchForm';

interface SearchPageProps {}

export const runtime = 'edge';

function SearchPage({}: SearchPageProps) {
  return (
    <>
      <h2 className="text-3xl">Custom Search</h2>

      <SearchForm className="w-full" />
    </>
  );
}

export default SearchPage;
