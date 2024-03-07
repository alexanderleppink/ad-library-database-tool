'use client';

import type { KeyboardEventHandler } from 'react';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SearchConfig } from '@/app/app/search/search.types';
import { createDefaultSearchConfig, SearchConfigSchema } from '@/app/app/search/search.types';
import SearchConfiguration from '@/app/app/search/SearchConfiguration';
import { Button, TextInput } from 'flowbite-react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import type { SearchQueryResultData } from '@/app/app/search/actions';
import { searchAds } from '@/app/app/search/actions';
import SearchResults from '@/app/app/(ad-query)/SearchResults';
import useSWRMutation from 'swr/mutation';
import clsx from 'clsx';
import { queryAllPages } from '@/app/app/(ad-query)/adQuery.helper';
import { startOfDay } from 'date-fns';

interface SearchFormProps {
  className?: string;
}

export function useSearch() {
  return useSWRMutation(
    'search',
    async (_, { arg }: { arg: SearchConfig }) =>
      await queryAllPages(searchAds)(arg, { totalLimit: arg.maxResults }).then((results) =>
        arg.checkOnlyStartDate ? filterStartDate(results, arg) : results
      )
  );
}

function filterStartDate(
  searchResults: SearchQueryResultData[],
  { deliveryDateStart, deliveryDateEnd }: SearchConfig
) {
  return searchResults.filter((result) => {
    console.log(result.ad_delivery_start_time, deliveryDateStart, deliveryDateEnd);
    return (
      (!deliveryDateStart ||
        startOfDay(new Date(result.ad_delivery_start_time)) >= deliveryDateStart) &&
      (!deliveryDateEnd || startOfDay(new Date(result.ad_delivery_start_time)) <= deliveryDateEnd)
    );
  });
}

function SearchForm({ className }: SearchFormProps) {
  const formObject = useForm({
    resolver: zodResolver(SearchConfigSchema),
    defaultValues: createDefaultSearchConfig()
  });

  const { data: searchResults, error, trigger, isMutating } = useSearch();

  return (
    <div className={clsx(className, 'flex flex-col gap-4')}>
      <div className="max-w-2xl mx-auto">
        <SearchConfiguration formObject={formObject} />
        <Search onSubmit={trigger} formObject={formObject} />
      </div>
      <SearchResults
        error={error?.message}
        queryResultData={searchResults}
        isLoading={isMutating}
      />
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
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = formObject;

  const handleKeyUp: KeyboardEventHandler = (event) => {
    if (isSubmitting) return;

    if (event.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex gap-1">
        <TextInput
          className="grow"
          placeholder="Search terms..."
          onKeyUp={handleKeyUp}
          {...register('searchTerms')}
        />
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          <MagnifyingGlassIcon className="h-5" />
        </Button>
      </div>
    </div>
  );
}

export default SearchForm;
