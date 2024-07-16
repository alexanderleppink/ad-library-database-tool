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

export function replaceQueryParams<T extends Record<string, string>>(
  url: string,
  updatedParams: Partial<T>
) {
  const urlObj = new URL(url);
  const params = Object.fromEntries(urlObj.searchParams.entries()) as T;
  const newParams = {
    ...params,
    ...updatedParams
  };

  urlObj.search = new URLSearchParams(newParams).toString();
  return urlObj.toString();
}
