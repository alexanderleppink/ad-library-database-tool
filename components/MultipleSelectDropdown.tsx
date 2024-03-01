import React, { useMemo } from 'react';
import { Checkbox, Dropdown, Label, TextInput } from 'flowbite-react';

interface MultipleSelectDropdownProps<T extends string | number> {
  items: { value: T; label: string }[];
  value: T[];
  onChange: (value: T[]) => unknown;
}

function MultipleSelectDropdown<T extends string | number>({
  items,
  onChange,
  value
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
      renderTrigger={() => <TextInput readOnly value={value.join(', ')} />}
      label=""
      dismissOnClick={false}
    >
      {items.map(({ value, label }) => (
        <Dropdown.Item key={value} onClick={() => handleItemClick(value)} className="flex gap-2">
          <Checkbox name={`checkbox-${value}`} checked={selectedSet.has(value)} />
          <Label htmlFor={`checkbox-${value}`}>{label}</Label>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}

export default MultipleSelectDropdown;
