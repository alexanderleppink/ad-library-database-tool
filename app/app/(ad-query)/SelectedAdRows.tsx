import React from 'react';
import type { GetSelectedAdRowsReturns, SelectedAdRowUpsert } from '@/types/supabaseHelper.types';
import { Button, Datepicker, Dropdown, Select } from 'flowbite-react';
import { z } from 'zod';
import { ensureMinOneItem } from '@/utils/typeUtils';
import { useForm } from 'react-hook-form';
import SaveIcon from '@/components/icons/SaveIcon';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { TrashIcon } from '@heroicons/react/24/solid';
import { formatISO } from 'date-fns';
import { v4 } from 'uuid';

interface SelectedAdRowsProps {
  rows: GetSelectedAdRowsReturns;
  onSelectedAdRowUpdate: (data: SelectedAdRowUpsert) => unknown;
  onSelectedAdRowDelete: (id: string) => unknown;
}

function SelectedAdRows({
  rows,
  onSelectedAdRowDelete,
  onSelectedAdRowUpdate
}: SelectedAdRowsProps) {
  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <SelectedAdRow
          key={row.ad_row_id}
          rowData={row}
          onRowUpsert={onSelectedAdRowUpdate}
          onRowDelete={onSelectedAdRowDelete}
        />
      ))}

      <SelectedAdRow
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
  { name: 'United Kingdom', code: 'GB' }
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
  rowData,
  onRowUpsert,
  onRowDelete
}: {
  rowData: GetSelectedAdRowsReturns[number] | null;
  onRowUpsert: (data: SelectedAdRowUpsert) => unknown;
  onRowDelete: (id: string) => unknown;
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: createDefaultSelectedAdRow(rowData)
  });

  const onSubmit = ({ country, date: dateTime }: SelectedAdRowForm) => {
    const date = formatISO(toZonedTime(dateTime, 'UTC'), { representation: 'date' });
    const id = rowData?.ad_row_id ?? v4();
    onRowUpsert({
      id,
      ad_id: rowData?.ad_id ?? '',
      country,
      date
    });
  };

  return (
    <div className="flex gap-0.5">
      <Select className="flex-1 w-0" sizing="sm" {...register('country')}>
        {availableCountries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </Select>
      <Datepicker {...register('date')} sizing="sm" className="flex-1 w-0" placeholder="Date" />
      <Button className="shrink-0" size="xs" color="blue" onClick={handleSubmit(onSubmit)}>
        <SaveIcon className="w-3 h-3" />
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
