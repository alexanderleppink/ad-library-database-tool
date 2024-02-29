import React from 'react';
import { FormFieldController, SelectFormField } from '@/components/FormField';
import type { UseFormReturn } from 'react-hook-form';
import type { SearchConfig } from '@/app/app/search/search.types';
import { countryList, languagesList } from '@/app/app/search/search.types';
import { Button, Datepicker } from 'flowbite-react';
import { format } from 'date-fns';
import { XCircleIcon } from '@heroicons/react/24/solid';

interface SearchConfigurationProps {
  formObject: UseFormReturn<SearchConfig>;
}

function SearchConfiguration({
  formObject: {
    control,
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

      <FormFieldController
        control={control}
        errors={errors}
        name="deliveryDateStart"
        render={DatepickerWithClearButton}
        label="Delivered after"
      />

      <FormFieldController
        control={control}
        errors={errors}
        name="deliveryDateEnd"
        render={DatepickerWithClearButton}
        label="Delivered before"
      />
    </div>
  );
}

function DatepickerWithClearButton({
  field: { value, onChange }
}: {
  field: {
    value: Date | string | null | undefined;
    onChange: (date: Date | null) => void;
  };
}) {
  return (
    <div className="flex">
      <Datepicker
        placeholder="Select date..."
        defaultDate={(value as Date) || undefined}
        value={displayDate(value)}
        onSelectedDateChanged={onChange}
      />
      <Button className="shrink-0 w-auto" size="xs" onClick={() => onChange(null)}>
        <XCircleIcon className="w-5" />
      </Button>
    </div>
  );
}

const displayDate = (date: Date | undefined | string | null) => {
  if (date instanceof Date) {
    return format(date, 'MMM dd, yyyy');
  }
  return '';
};

export default SearchConfiguration;
