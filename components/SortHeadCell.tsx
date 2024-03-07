import { Table } from 'flowbite-react';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface TableHeadCellProps {
  value: 'up' | 'down' | null | undefined;

  onChange(value: 'up' | 'down' | null): unknown;
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
      case 'up':
        return onChange('down');
      case 'down':
        return onChange(null);
      default:
        return onChange('up');
    }
  };

  return (
    <Table.HeadCell className="gap-2" onClick={handleClick}>
      <span>{children}</span>
      <Arrow className="w-3" />
    </Table.HeadCell>
  );
}

export default SortHeadCell;
