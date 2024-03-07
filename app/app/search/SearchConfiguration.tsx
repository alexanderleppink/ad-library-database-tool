import React from 'react';
import { FormFieldController, SelectFormField, TextInputFormField } from '@/components/FormField';
import type { UseFormReturn } from 'react-hook-form';
import type { SearchConfig } from '@/app/app/search/search.types';
import { adStatusList } from '@/app/app/search/search.types';
import { countryList, languagesList } from '@/app/app/search/search.types';
import { Button, Checkbox, Datepicker } from 'flowbite-react';
import { format } from 'date-fns';
import { XCircleIcon } from '@heroicons/react/24/solid';
import MultipleSelectDropdown from '@/components/MultipleSelectDropdown';

interface SearchConfigurationProps {
  formObject: UseFormReturn<SearchConfig>;
}

function SearchConfiguration({
  formObject: {
    control,
    register,
    formState: { errors }
  }
}: SearchConfigurationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border rounded p-4">
      <FormFieldController
        control={control}
        errors={errors}
        name="languages"
        render={({ field: { value, onChange } }) => (
          <MultipleSelectDropdown
            value={value || []}
            items={languagesList.map((lang) => ({
              value: lang,
              label: lang
            }))}
            onChange={onChange}
          />
        )}
        label="Languages"
      />

      <FormFieldController
        control={control}
        errors={errors}
        name="countries"
        render={({ field: { value, onChange } }) => (
          <MultipleSelectDropdown
            value={value || []}
            items={countryList.map((country) => ({
              value: country,
              label: country
            }))}
            onChange={onChange}
          />
        )}
        label="Countries"
      />

      <FormFieldController
        control={control}
        errors={errors}
        name="deliveryDateStart"
        render={DatepickerWithClearButton}
        label="Delivered after"
      />

      <div className="flex flex-col">
        <FormFieldController
          control={control}
          errors={errors}
          name="deliveryDateEnd"
          render={DatepickerWithClearButton}
          label="Delivered before"
        />
        <div className="flex gap-2 items-center self-end">
          <Checkbox {...register('checkOnlyStartDate')} />
          <label className="text-sm">Check only start date</label>
        </div>
      </div>

      <SelectFormField {...register('status')} label="Ad status" errors={errors}>
        {adStatusList.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </SelectFormField>

      <TextInputFormField
        {...register('maxResults', { valueAsNumber: true })}
        type="number"
        label="Maximum results"
        errors={errors}
      />
    </div>
  );
}

function DatepickerWithClearButton({
  field: { value, onChange }
}: {
  field: {
    value: Date | null | undefined;
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
