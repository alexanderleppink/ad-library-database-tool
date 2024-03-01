import type {
  ForwardRefExoticComponent,
  MutableRefObject,
  ReactNode,
  Ref,
  RefAttributes
} from 'react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type {
  FlowbiteSelectTheme,
  FlowbiteTextInputTheme,
  SelectProps,
  TextInputProps
} from 'flowbite-react';
import { Select, TextInput } from 'flowbite-react';
import clsx from 'clsx';
import type {
  ControllerProps,
  FieldError,
  FieldErrors,
  FieldErrorsImpl,
  FieldValues,
  Merge
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { DeepPartial } from 'ts-essentials';
import { get, isFunction } from 'lodash-es';
import type { FieldPath } from 'react-hook-form/dist/types';

type FormFieldProps<T extends SelectProps | TextInputProps> = T & FormFrameProps;

type FormFrameProps = {
  label: string;
  required?: boolean;
  errors: FieldErrors<any>;
  name: string;
  className?: string;
};

function withFormField<
  Props extends SelectProps | TextInputProps,
  Element extends Props extends SelectProps ? HTMLSelectElement : HTMLInputElement
>(
  Component: ForwardRefExoticComponent<Props & RefAttributes<Element>>,
  themeFn: (
    value: string
  ) =>
    | DeepPartial<Props extends SelectProps ? FlowbiteSelectTheme : FlowbiteTextInputTheme>
    | undefined
) {
  return forwardRef(function FormField(
    formFieldProps: FormFieldProps<Props>,
    forwardRef: Ref<Element>
  ) {
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
      <FormFrame {...formFieldProps}>
        {({ errorMessage }) => (
          <Component
            color={errorMessage ? 'failure' : undefined}
            {...formFieldProps}
            onBlur={onBlur}
            ref={inputRef}
            theme={themeFn(value)}
          />
        )}
      </FormFrame>
    );
  });
}

export function FormFrame({
  errors,
  label,
  required,
  className,
  name,
  children
}: FormFrameProps & {
  children: (obj: {
    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
    errorMessage: string | null;
  }) => ReactNode;
}) {
  const error = get(errors, name as string);
  const errorMessage = getErrorMessage(error);
  return (
    <div className={clsx('flex flex-col space-y-1', className)}>
      <div className="text-sm leading-6">
        {label}
        {required ? '*' : ''}
      </div>
      {children({ error, errorMessage })}
      <div
        className={clsx('text-xs text-red-500', {
          'opacity-0': !errorMessage
        })}
      >
        {errorMessage ?? 'empty'}
      </div>
    </div>
  );
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

export const TextInputFormField = withFormField(TextInput, () => undefined);

export const SelectFormField = withFormField(Select, () => undefined);

export function FormFieldController<T extends FieldValues, N extends FieldPath<T>>({
  control,
  render,
  name,
  ...formFrameProps
}: Omit<FormFrameProps, 'name'> & ControllerProps<T, N>) {
  return (
    <FormFrame {...formFrameProps} name={name}>
      {() => <Controller name={name} control={control} render={(val) => render(val)} />}
    </FormFrame>
  );
}
