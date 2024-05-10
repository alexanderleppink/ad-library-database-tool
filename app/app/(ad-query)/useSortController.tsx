import React, { useMemo, useState } from 'react';
import type { SearchCardItemData } from '@/app/app/(ad-query)/SearchResultCards';
import { noop, orderBy } from 'lodash-es';
import { SelectFormField, TextInputFormField } from '@/components/FormField';
import type { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { MediaData } from '@/app/app/(ad-query)/useFetchMedia';

type SortColumnProperty = keyof Pick<
  SearchCardItemData,
  'eu_total_reach' | 'ad_delivery_start_time' | 'domain'
>;

type SortDirection = 'asc' | 'desc';

type ProductType = 'shopify' | 'all';

interface SortForm {
  sortDirection: SortDirection;
  sortColumn: SortColumnProperty;
  minimumReach: number;
  productType: ProductType;
}

export function useSortController(
  unsortedData: SearchCardItemData[] | undefined,
  mediaDataMap: Map<string, MediaData>
) {
  const formObject = useForm<SortForm>({
    defaultValues: {
      sortColumn: 'ad_delivery_start_time',
      sortDirection: 'desc',
      minimumReach: 25000,
      productType: 'all'
    }
  });

  const sortColumn = formObject.watch('sortColumn');
  const sortDirection = formObject.watch('sortDirection');
  const minimumReach = formObject.watch('minimumReach');
  const productType = formObject.watch('productType');
  const sortedData = useMemo(() => {
    const filterMinReach = ({ eu_total_reach }: SearchCardItemData) =>
      eu_total_reach >= minimumReach;

    return orderBy(unsortedData?.filter(filterMinReach) ?? [], [sortColumn], [sortDirection]);
  }, [minimumReach, sortColumn, sortDirection, unsortedData]);

  return {
    mediaFilters: {
      productType
    },
    sortedData,
    sortController: <SortController formObject={formObject} />
  };
}

interface SortControllerProps {
  formObject: UseFormReturn<SortForm>;
}

function SortController({
  formObject: {
    register,
    setValue,
    getValues,
    formState: { errors }
  }
}: SortControllerProps) {
  const [minimumReach, setMinimumReach] = useState(getValues().minimumReach);
  return (
    <div className="flex gap-2 items-center">
      <SelectFormField {...register('sortColumn')} label="Sort by field" errors={errors}>
        <option value={'domain' satisfies SortColumnProperty}>Domain</option>
        <option value={'eu_total_reach' satisfies SortColumnProperty}>Reach</option>
        <option value={'ad_delivery_start_time' satisfies SortColumnProperty}>Start Date</option>
      </SelectFormField>

      <SelectFormField {...register('sortDirection')} label="Sort direction" errors={errors}>
        <option value={'asc' satisfies SortDirection}>Ascending</option>
        <option value={'desc' satisfies SortDirection}>Descending</option>
      </SelectFormField>

      <TextInputFormField
        {...register('minimumReach', {
          value: minimumReach,
          onChange: (event) => setMinimumReach(event.target.value),
          onBlur: (event) => setValue('minimumReach', event.target.value)
        })}
        label="Minimum reach"
        type="number"
        errors={errors}
      />

      <SelectFormField {...register('productType')} label="Product type" errors={errors}>
        <option value={'all' satisfies ProductType}>All</option>
        <option value={'shopify' satisfies ProductType}>Shopify</option>
      </SelectFormField>
    </div>
  );
}

export default SortController;
