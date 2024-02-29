'use client';

import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AdStatus, SearchConfig } from '@/app/app/search/search.types';
import { adStatusList } from '@/app/app/search/search.types';
import { createDefaultSearchConfig, SearchConfigSchema } from '@/app/app/search/search.types';
import SearchConfiguration from '@/app/app/search/SearchConfiguration';
import { Button, Dropdown, TextInput } from 'flowbite-react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface SearchFormProps {}

function SearchForm({}: SearchFormProps) {
  const formObject = useForm({
    resolver: zodResolver(SearchConfigSchema),
    defaultValues: createDefaultSearchConfig()
  });

  const handleSearch = (data: SearchConfig) => {
    console.log(data);
  };

  return (
    <div>
      <SearchConfiguration formObject={formObject} />
      <Search onSubmit={handleSearch} formObject={formObject} />
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
  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex gap-1">
        <TextInput className="grow" {...register('searchTerms')} />
        <Button onClick={handleSubmit(onSubmit)}>
          <MagnifyingGlassIcon className="h-5" />
        </Button>
      </div>
      <StatusRow formObject={formObject} className="self-center" />
    </div>
  );
}

function StatusRow({
  formObject: { control },
  className
}: {
  className?: string;
  formObject: UseFormReturn<SearchConfig>;
}) {
  const getStatusText = (status: AdStatus) => {
    switch (status) {
      case 'active':
        return 'only active';
      case 'inactive':
        return 'only inactive';
      case 'all':
        return 'all';
    }
  };
  return (
    <div className={clsx(className, 'flex gap-2 text')}>
      include
      <Controller
        control={control}
        render={({ field: { value, onChange } }) => (
          <Dropdown
            value={value}
            label=""
            renderTrigger={() => (
              <div className="font-medium text-blue-600 hover:underline cursor-pointer">
                {getStatusText(value as AdStatus)}
              </div>
            )}
          >
            {adStatusList.map((status) => (
              <Dropdown.Item key={status} onClick={() => onChange(status)}>
                {getStatusText(status)}
              </Dropdown.Item>
            ))}
          </Dropdown>
        )}
        name="status"
      />
      ads
    </div>
  );
}

export default SearchForm;
