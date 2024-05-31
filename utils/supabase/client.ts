import type { PostgrestMaybeSingleResponse } from '@supabase/postgrest-js/src/types';
import { refreshAuth } from '@/utils/supabase/actions';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function ensureAuth<T extends PostgrestMaybeSingleResponse<any>>(
  fn: () => PromiseLike<T>
) {
  const result = await fn();
  if (result.status === 403) {
    const session = await refreshAuth();
    await createClientComponentClient().auth.setSession(session);
    return fn();
  }
  return result;
}
