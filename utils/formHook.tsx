import type { FieldError, Merge } from 'react-hook-form';

export const mapError = (
  error: FieldError | undefined | Merge<FieldError, (FieldError | undefined)[]>
) => (error ? 'failure' : undefined);
