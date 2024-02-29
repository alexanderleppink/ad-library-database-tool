import type { ForwardRefExoticComponent, MutableRefObject, Ref, RefAttributes } from 'react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type {
  FlowbiteSelectTheme,
  FlowbiteTextInputTheme,
  SelectProps,
  TextInputProps
} from 'flowbite-react';
import { getTheme, Select, TextInput } from 'flowbite-react';
import clsx from 'clsx';
import type { FieldError, FieldErrors, FieldErrorsImpl, Merge } from 'react-hook-form';
import type { DeepPartial } from 'ts-essentials';
import { get, isFunction } from 'lodash-es';

type FormFieldProps<T extends SelectProps | TextInputProps> = T & {
  label: string;
  required?: boolean;
  errors: FieldErrors<any>;
};

function withFormField<
  Props extends SelectProps | TextInputProps,
  Element extends Props extends SelectProps ? HTMLSelectElement : HTMLInputElement
>(
  Component: ForwardRefExoticComponent<Props & RefAttributes<Element>>,
  themeFn: (
    value: string
  ) => DeepPartial<Props extends SelectProps ? FlowbiteSelectTheme : FlowbiteTextInputTheme>
) {
  return forwardRef(function FormField(
    formFieldProps: FormFieldProps<Props>,
    forwardRef: Ref<Element>
  ) {
    const error = get(formFieldProps.errors, formFieldProps.name as string);
    const errorMessage = getErrorMessage(error);

    const ref = useRef<Element>(null);
    const inputRef = forwardRef
      ? isFunction(forwardRef)
        ? (elem: Element) => {
            (ref as MutableRefObject<Element>).current = elem;
            forwardRef(elem);
          }
        : forwardRef
      : ref;

    const [value, setValue] = useState<string>('');

    const onBlur = (e: React.FocusEvent<Element>) => {
      setValue(ref.current?.value || '');
      formFieldProps?.onBlur?.(e as any);
    };

    useEffect(() => {
      setValue(ref.current?.value || '');
    }, [ref.current?.value]);

    return (
      <div className={clsx('flex flex-col space-y-1', formFieldProps.className)}>
        <div className="text-sm leading-6">
          {formFieldProps.label}
          {formFieldProps.required ? '*' : ''}
        </div>
        <Component
          color={errorMessage ? 'failure' : undefined}
          {...formFieldProps}
          onBlur={onBlur}
          ref={inputRef}
          theme={themeFn(value)}
        />
        <div
          className={clsx('text-xs text-red-500', {
            'opacity-0': !errorMessage
          })}
        >
          {errorMessage ?? 'empty'}
        </div>
      </div>
    );
  });
}

function getErrorMessage(error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined) {
  if (!error) {
    return null;
  }

  if (error.message) {
    return error.message as string;
  }

  switch (error.type) {
    case 'required':
      return 'This field is required.';
    default:
      return 'This field is invalid.';
  }
}

export const TextInputFormField = withFormField(TextInput, (value) => ({
  field: {
    input: {
      colors: {
        gray: `${getTheme().textInput.field.input.colors.gray} ${value ? '!border-gray-700' : ''}`
      }
    }
  }
}));

export const SelectFormField = withFormField(Select, (value) => ({
  field: {
    select: {
      colors: {
        gray: `${getTheme().select.field.select.colors.gray} ${value ? '!border-gray-700' : ''}`
      }
    }
  }
}));
