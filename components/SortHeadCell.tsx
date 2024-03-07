import { Table } from 'flowbite-react';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

export type SortArrowValue = 'up' | 'down' | null | undefined;

export interface TableHeadCellProps {
  value: SortArrowValue;

  onChange(value: SortArrowValue): unknown;
}

function SortHeadCell({ children, value, onChange }: PropsWithChildren<TableHeadCellProps>) {
  const Arrow = (() => {
    switch (value) {
      case 'up':
        return ChevronUpIcon;
      case 'down':
        return ChevronDownIcon;
      default:
        return ChevronUpDownIcon;
    }
  })();

  const handleClick = () => {
    switch (value) {
      case 'down':
        return onChange('up');
      case 'up':
        return onChange(null);
      default:
        return onChange('down');
    }
  };

  return (
    <Table.HeadCell onClick={handleClick}>
      <div className="gap-2 flex cursor-pointer">
        <span>{children}</span>
        <Arrow className="w-3" />
      </div>
    </Table.HeadCell>
  );
}

export default SortHeadCell;
