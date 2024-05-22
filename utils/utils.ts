import { format } from 'date-fns';

export function numberWithThousandSeparator(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const displayDate = (date: Date | undefined | string | null) => {
  if (date instanceof Date) {
    return format(date, 'MMM dd, yyyy');
  }
  return '';
};
