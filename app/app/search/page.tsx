import React from 'react';
import SearchForm from '@/app/app/search/SearchForm';
import { ExcludedDomainsProvider } from '@/contexts/ExcludedDomainsContext';

interface SearchPageProps {}

export const runtime = 'edge';

function SearchPage({}: SearchPageProps) {
  return (
    <ExcludedDomainsProvider>
      <h2 className="text-3xl">Custom Search</h2>

      <SearchForm className="w-full" />
    </ExcludedDomainsProvider>
  );
}

export default SearchPage;
