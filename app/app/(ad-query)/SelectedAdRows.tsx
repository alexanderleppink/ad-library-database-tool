import React from 'react';
import type { GetSelectedAdRowsReturns, SelectedAdRowUpsert } from '@/types/supabaseHelper.types';
import { Button, Datepicker, Select } from 'flowbite-react';
import { z } from 'zod';
import { ensureMinOneItem } from '@/utils/typeUtils';
import { Controller, useForm } from 'react-hook-form';
import SaveIcon from '@/components/icons/SaveIcon';
import { fromZonedTime } from 'date-fns-tz';
import { TrashIcon } from '@heroicons/react/24/solid';
import { formatISO } from 'date-fns';
import { v4 } from 'uuid';
import { PlusIcon } from '@heroicons/react/16/solid';
import { mapError } from '@/utils/formHook';
import { zodResolver } from '@hookform/resolvers/zod';

interface SelectedAdRowsProps {
  adId: string;
  rows: GetSelectedAdRowsReturns;
  onSelectedAdRowUpdate: (data: SelectedAdRowUpsert) => Promise<unknown>;
  onSelectedAdRowDelete: (id: string) => Promise<unknown>;
}

function SelectedAdRows({
  adId,
  rows,
  onSelectedAdRowDelete,
  onSelectedAdRowUpdate
}: SelectedAdRowsProps) {
  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <SelectedAdRow
          adId={adId}
          key={row.ad_row_id}
          rowData={row}
          onRowUpsert={onSelectedAdRowUpdate}
          onRowDelete={onSelectedAdRowDelete}
        />
      ))}

      <SelectedAdRow
        adId={adId}
        rowData={null}
        onRowUpsert={onSelectedAdRowUpdate}
        onRowDelete={onSelectedAdRowDelete}
      />
    </div>
  );
}

const availableCountries = [
  { name: 'Netherlands', code: 'NL' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Italy', code: 'IT' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Norway', code: 'NO' },
  { name: 'Finland', code: 'FI' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Australia', code: 'AU' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Austria', code: 'AT' }
] as const;

export const SelectedAdRowSchema = z.object({
  country: z.enum(ensureMinOneItem(availableCountries.map((country) => country.code))),
  date: z.date()
});

export type SelectedAdRowForm = z.infer<typeof SelectedAdRowSchema>;

function createDefaultSelectedAdRow(
  data: GetSelectedAdRowsReturns[number] | null
): SelectedAdRowForm {
  return {
    country: data?.country ?? ('' as any),
    date: data?.date ? fromZonedTime(data.date, 'UTC') : new Date()
  };
}

function SelectedAdRow({
  adId,
  rowData,
  onRowUpsert,
  onRowDelete
}: {
  adId: string;
  rowData: GetSelectedAdRowsReturns[number] | null;
  onRowUpsert: (data: SelectedAdRowUpsert) => Promise<unknown>;
  onRowDelete: (id: string) => Promise<unknown>;
}) {
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, defaultValues }
  } = useForm({
    resolver: zodResolver(SelectedAdRowSchema),
    defaultValues: createDefaultSelectedAdRow(rowData)
  });

  const onSubmit = async ({ country, date: dateTime }: SelectedAdRowForm) => {
    const date = formatISO(fromZonedTime(dateTime, 'UTC'), { representation: 'date' });
    const id = rowData?.ad_row_id ?? v4();
    await onRowUpsert({
      id,
      ad_id: adId,
      country,
      date
    });

    if (!rowData) {
      reset(createDefaultSelectedAdRow(null));
    }
  };

  return (
    <div className="flex gap-0.5">
      <Select
        className="flex-1 w-0"
        sizing="sm"
        {...register('country')}
        color={mapError(errors?.country)}
      >
        {availableCountries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </Select>
      <Controller
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Datepicker
            key={defaultValues?.date?.getTime()}
            defaultDate={value}
            onSelectedDateChanged={onChange}
            sizing="sm"
            className="flex-1 w-0"
            placeholder="Date"
            color={mapError(error)}
          />
        )}
        name="date"
      />
      <Button className="shrink-0" size="xs" color="blue" onClick={handleSubmit(onSubmit)}>
        {rowData ? <SaveIcon className="w-3 h-3" /> : <PlusIcon className="w-3 h-3" />}
      </Button>
      <Button
        className="shrink-0"
        size="xs"
        color="failure"
        disabled={!rowData}
        onClick={() => onRowDelete(rowData!.ad_row_id)}
      >
        <TrashIcon className="w-3 h-3" />
      </Button>
    </div>
  );
}

export default SelectedAdRows;
