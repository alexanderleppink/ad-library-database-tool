import type { PostgrestMaybeSingleResponse } from '@supabase/postgrest-js/src/types';
import { refreshAuth } from '@/utils/supabase/actions';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';

export async function ensureAuth<T extends PostgrestMaybeSingleResponse<any>>(
  fn: () => PromiseLike<T>
) {
  const result = await fn();
  if (result.status === 403) {
    await refreshSession();
    return fn();
  }
  return result;
}

export async function refreshSession() {
  const session = await refreshAuth();
  if (session) {
    await createClientComponentClient().auth.setSession(session);
  }
  return session;
}

export async function getFreshUser(user: User | null) {
  return user ?? (await refreshSession().then(({ user }) => user))!;
}
