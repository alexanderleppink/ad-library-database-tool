import React from 'react';
import type { SearchCardItemData } from '@/app/app/(ad-query)/SearchResultCards';
import { orderBy } from 'lodash-es';
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

  const filterMinReach = ({ eu_total_reach }: SearchCardItemData) => eu_total_reach >= minimumReach;

  const filterProductType = ({ id }: SearchCardItemData) => {
    const mediaData = mediaDataMap.get(id);
    switch (productType) {
      case 'shopify':
        return !mediaData || !!mediaData.linkUrl?.includes('/products/');
      case 'all':
        return true;
    }
  };

  return {
    sortedData: orderBy(
      unsortedData?.filter(filterMinReach).filter(filterProductType) ?? [],
      [sortColumn],
      [sortDirection]
    ),
    sortController: <SortController formObject={formObject} />
  };
}

interface SortControllerProps {
  formObject: UseFormReturn<SortForm>;
}

function SortController({
  formObject: {
    register,
    formState: { errors }
  }
}: SortControllerProps) {
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
        {...register('minimumReach')}
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
