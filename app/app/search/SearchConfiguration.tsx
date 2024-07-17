import React from 'react';
import { FormFieldController, SelectFormField } from '@/components/FormField';
import type { UseFormReturn } from 'react-hook-form';
import type { SearchConfig } from '@/app/app/search/search.types';
import { countryLabels } from '@/app/app/search/search.types';
import {
  adStatusList,
  countryList,
  languagesList,
  nonEuCountries
} from '@/app/app/search/search.types';
import { Button, Card, Checkbox, Datepicker, Tooltip } from 'flowbite-react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import MultipleSelectDropdown from '@/components/MultipleSelectDropdown';
import { initialPageSize } from '@/app/app/(ad-query)/adQuery.types';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { displayDate } from '@/utils/utils';

interface SearchConfigurationProps {
  formObject: UseFormReturn<SearchConfig>;
}

function SearchConfiguration({
  formObject: {
    control,
    register,
    watch,
    formState: { errors }
  }
}: SearchConfigurationProps) {
  const allLanguages = watch('allLanguages');
  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <FormFieldController
          control={control}
          errors={errors}
          name="languages"
          render={({ field: { value, onChange } }) => (
            <MultipleSelectDropdown
              disabled={!!allLanguages}
              value={value || []}
              items={languagesList.map((lang) => ({
                value: lang,
                label: lang
              }))}
              onChange={onChange}
            />
          )}
          label={
            <div className="flex justify-between items-center">
              <span>Languages</span>

              <div className="flex space-x-1 items-center">
                <span>All languages</span>
                <Checkbox {...register('allLanguages')} />
              </div>
            </div>
          }
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
                label: countryLabels[country]?.label ?? country,
                tooltip: nonEuCountries.includes(country as (typeof nonEuCountries)[number])
                  ? 'Only ads will be returned that also target EU countries'
                  : undefined
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

        <SelectFormField
          {...register('pageSize', { valueAsNumber: true })}
          label={
            <Tooltip content="Only change if necessary">
              <div className="flex gap-2 items-center">
                Page size
                <QuestionMarkCircleIcon className="w-3 h-3" />
              </div>
            </Tooltip>
          }
          errors={errors}
        >
          <option>{500}</option>
          <option>{1000}</option>
          <option>{1500}</option>
          <option>{2000}</option>
          <option>{3000}</option>
          <option>{initialPageSize}</option>
        </SelectFormField>

        <SelectFormField
          {...register('maxResults', { valueAsNumber: true })}
          label="Maximum results"
          errors={errors}
        >
          <option>{initialPageSize / 4}</option>
          <option>{initialPageSize / 2}</option>
          <option>{initialPageSize}</option>
          <option>{initialPageSize * 2}</option>
          <option>{initialPageSize * 4}</option>
          <option>{initialPageSize * 8}</option>
          <option>{initialPageSize * 16}</option>
          <option value={0}>No limit</option>
        </SelectFormField>

        <SelectFormField {...register('status')} label="Ad status" errors={errors}>
          {adStatusList.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </SelectFormField>
      </div>
    </Card>
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

export default SearchConfiguration;
