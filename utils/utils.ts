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
