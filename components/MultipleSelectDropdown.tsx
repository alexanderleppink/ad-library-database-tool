import type { PropsWithChildren } from 'react';
import React, { useMemo } from 'react';
import { Checkbox, Dropdown, Label, TextInput, Tooltip } from 'flowbite-react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface MultipleSelectDropdownProps<T extends string | number> {
  items: { value: T; label: string; tooltip?: string }[];
  value: T[];
  onChange: (value: T[]) => unknown;
  disabled?: boolean;
}

function MultipleSelectDropdown<T extends string | number>({
  items,
  onChange,
  value,
  disabled
}: MultipleSelectDropdownProps<T>) {
  const selectedSet = useMemo(() => new Set(value), [value]);

  const handleItemClick = (item: T) => {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <Dropdown
      className="overflow-y-auto max-h-80"
      disabled={disabled}
      renderTrigger={() => <TextInput readOnly value={value.join(', ')} />}
      label=""
      dismissOnClick={false}
    >
      {items.map(({ value, label, tooltip }) => (
        <Dropdown.Item key={value} onClick={() => handleItemClick(value)} className="flex gap-2">
          <TooltipWrapper tooltip={tooltip}>
            <Checkbox
              name={`checkbox-${value}`}
              checked={selectedSet.has(value)}
              readOnly
              className="cursor-pointer"
            />
            <Label htmlFor={`checkbox-${value}`} className="cursor-pointer">
              {label}
            </Label>
          </TooltipWrapper>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}

function TooltipWrapper({ tooltip, children }: PropsWithChildren<{ tooltip?: string }>) {
  return !tooltip ? (
    <>{children}</>
  ) : (
    <Tooltip content={tooltip}>
      <div className="flex gap-2 items-center">
        {children}
        <QuestionMarkCircleIcon className="h-3" />
      </div>
    </Tooltip>
  );
}

export default MultipleSelectDropdown;
