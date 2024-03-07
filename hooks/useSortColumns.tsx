import type { SortArrowValue, TableHeadCellProps } from '@/components/SortHeadCell';
import { getEntries } from '@/utils/typeUtils';
import { useState } from 'react';
import { orderBy } from 'lodash-es';

export function useSortColumns<T, K extends string>(
  array: T[],
  config: Record<K, (item: T) => string | number>
) {
  const [sortColumn, setSortColumn] = useState<K | null>(null);
  const [sortDirection, setSortDirection] = useState<SortArrowValue>(null);

  const entries = getEntries(config);
  const handlers = Object.fromEntries(
    entries.map(([key]) => {
      const onChange = (value: SortArrowValue) => {
        setSortColumn(value === null ? null : key);
        setSortDirection(value);
      };
      const value = sortColumn === key ? sortDirection : null;
      return [key, { onChange, value }] as const;
    })
  ) as Record<K, TableHeadCellProps>;

  return {
    handlers,
    sortedArray: sortColumn
      ? orderBy(array, sortColumn ? [config[sortColumn]] : [], [
          sortDirection === 'up' ? 'asc' : 'desc'
        ])
      : array
  };
}
