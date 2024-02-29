import type { DeepWritable } from 'ts-essentials';

type Entries<T> = {
  [K in keyof Required<T>]: [K, T[K]];
}[keyof T][];

export const getEntries = <T extends object>(obj: T): Entries<T> =>
  Object.entries(obj) as Entries<T>;

export function mutable<T>(value: T): DeepWritable<T> {
  return value as any;
}

export function ensureMinOneItem<T>(arr: T[]): [T, ...T[]] {
  if (arr.length === 0) {
    throw new Error('Array must contain at least one item');
  }
  return arr as any;
}
