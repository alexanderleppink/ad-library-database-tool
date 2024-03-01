'use client';

import type { KeyboardEventHandler } from 'react';
import React, { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SearchConfig } from '@/app/app/search/search.types';
import { createDefaultSearchConfig, SearchConfigSchema } from '@/app/app/search/search.types';
import SearchConfiguration from '@/app/app/search/SearchConfiguration';
import { Button, TextInput } from 'flowbite-react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { searchAds } from '@/app/app/search/actions';
import type { QueryResultData } from '@/app/app/(ad-query)/adQuery.types';
import SearchResults from '@/app/app/(ad-query)/SearchResults';

interface SearchFormProps {}

function SearchForm({}: SearchFormProps) {
  const formObject = useForm({
    resolver: zodResolver(SearchConfigSchema),
    defaultValues: createDefaultSearchConfig()
  });

  const [searchResults, setSearchResults] = useState<QueryResultData[]>();

  const handleSearch = async (data: SearchConfig) => {
    const searchResults = await searchAds(data);
    setSearchResults(searchResults);
  };

  return (
    <div>
      <SearchConfiguration formObject={formObject} />
      <Search onSubmit={handleSearch} formObject={formObject} />
      {searchResults && <SearchResults queryResultData={searchResults} />}
    </div>
  );
}

function Search({
  onSubmit,
  formObject
}: {
  formObject: UseFormReturn<SearchConfig>;
  onSubmit: (data: SearchConfig) => unknown;
}) {
  const { register, handleSubmit } = formObject;

  const handleKeyUp: KeyboardEventHandler = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex gap-1">
        <TextInput className="grow" onKeyUp={handleKeyUp} {...register('searchTerms')} />
        <Button onClick={handleSubmit(onSubmit)}>
          <MagnifyingGlassIcon className="h-5" />
        </Button>
      </div>
    </div>
  );
}

export default SearchForm;
