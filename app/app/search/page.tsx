import React from 'react';
import SearchForm from '@/app/app/search/SearchForm';

interface SearchPageProps {}

function SearchPage({}: SearchPageProps) {
  return (
    <>
      <h2 className="text-3xl">Custom Search</h2>

      <SearchForm />
    </>
  );
}

export default SearchPage;
