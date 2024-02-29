import { z } from 'zod';
import { ensureMinOneItem, mutable } from '@/utils/typeUtils';

export const countryList = ['NL', 'FR', 'IT', 'ES', 'DE', 'CH', 'SE', 'NO', 'DK', 'FI'] as const;
export const languagesList = ['nl', 'fr', 'it', 'es', 'de', 'ch', 'se', 'no', 'dk', 'fi'] as const;
export const adStatusList = ['all', 'active', 'inactive'] as const;
export type AdStatus = (typeof adStatusList)[number];

export const SearchConfigSchema = z
  .object({
    searchTerms: z.string(),
    status: z.enum(ensureMinOneItem(mutable(adStatusList))),
    languages: z.enum(ensureMinOneItem(mutable(languagesList))),
    countries: z.enum(ensureMinOneItem(mutable(countryList))),
    deliveryDateStart: z.string().datetime(),
    deliveryDateEnd: z.string().datetime()
  })
  .partial();

export type SearchConfig = z.infer<typeof SearchConfigSchema>;

export function createDefaultSearchConfig(): SearchConfig {
  return {
    searchTerms: '',
    status: 'active',
    languages: 'nl',
    countries: 'NL',
    deliveryDateStart: '',
    deliveryDateEnd: ''
  };
}
