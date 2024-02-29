import React from 'react';
import { SelectFormField } from '@/components/FormField';
import type { UseFormReturn } from 'react-hook-form';
import { countryList, languagesList, SearchConfig } from '@/app/app/search/search.types';
import { Datepicker } from 'flowbite-react';

interface SearchConfigurationProps {
  formObject: UseFormReturn<SearchConfig>;
}

function SearchConfiguration({
  formObject: {
    formState: { errors },
    register
  }
}: SearchConfigurationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 border rounded p-4">
      <SelectFormField label="Languages" errors={errors} {...register(`languages`)}>
        {languagesList.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </SelectFormField>
      <SelectFormField label="Reached countries" errors={errors} {...register(`countries`)}>
        {countryList.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </SelectFormField>

      <Datepicker {...register(`deliveryDateStart`)} />
      <Datepicker {...register(`deliveryDateEnd`)} />
    </div>
  );
}

export default SearchConfiguration;
