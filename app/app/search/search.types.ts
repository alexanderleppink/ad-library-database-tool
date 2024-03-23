import { z } from 'zod';
import { ensureMinOneItem, mutable } from '@/utils/typeUtils';
import { pageSize } from '@/app/app/(ad-query)/adQuery.types';

export const countryList = ['NL', 'FR', 'IT', 'ES', 'DE', 'CH', 'SE', 'NO', 'DK', 'FI'] as const;
export const languagesList = ['nl', 'fr', 'it', 'es', 'de', 'sv', 'nb', 'da', 'fi'] as const;
export const adStatusList = ['ALL', 'ACTIVE', 'INACTIVE'] as const;
export type AdStatus = (typeof adStatusList)[number];

export const SearchConfigSchema = z.object({
  searchTerms: z.string().min(1),
  status: z.enum(ensureMinOneItem(mutable(adStatusList))),
  languages: z.array(z.enum(ensureMinOneItem(mutable(languagesList)))).min(1),
  allLanguages: z.boolean().optional(),
  countries: z.array(z.enum(ensureMinOneItem(mutable(countryList)))).min(1),
  deliveryDateStart: z.date().nullable(),
  deliveryDateEnd: z.date().nullable(),
  checkOnlyStartDate: z.boolean().optional(),
  maxResults: z.number().optional()
});

export type SearchConfig = z.infer<typeof SearchConfigSchema>;

export function createDefaultSearchConfig(): SearchConfig {
  return {
    searchTerms: '',
    allLanguages: true,
    status: 'ACTIVE',
    languages: ['nl'],
    countries: ['NL'],
    deliveryDateStart: null,
    deliveryDateEnd: null,
    maxResults: pageSize * 2,
    checkOnlyStartDate: false
  };
}
