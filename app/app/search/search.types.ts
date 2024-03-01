import { z } from 'zod';
import { ensureMinOneItem, mutable } from '@/utils/typeUtils';

export const countryList = ['NL', 'FR', 'IT', 'ES', 'DE', 'CH', 'SE', 'NO', 'DK', 'FI'] as const;
export const languagesList = ['nl', 'fr', 'it', 'es', 'de', 'ch', 'se', 'no', 'dk', 'fi'] as const;
export const adStatusList = ['ALL', 'ACTIVE', 'INACTIVE'] as const;
export type AdStatus = (typeof adStatusList)[number];

export const SearchConfigSchema = z.object({
  searchTerms: z.string(),
  status: z.enum(ensureMinOneItem(mutable(adStatusList))),
  languages: z.array(z.enum(ensureMinOneItem(mutable(languagesList)))).min(1),
  countries: z.array(z.enum(ensureMinOneItem(mutable(countryList)))).min(1),
  deliveryDateStart: z.date().nullable(),
  deliveryDateEnd: z.date().nullable(),
  maxResults: z.number().optional()
});

export type SearchConfig = z.infer<typeof SearchConfigSchema>;

export function createDefaultSearchConfig(): SearchConfig {
  return {
    searchTerms: '',
    status: 'ACTIVE',
    languages: ['nl'],
    countries: ['NL'],
    deliveryDateStart: null,
    deliveryDateEnd: null,
    maxResults: 10000
  };
}
