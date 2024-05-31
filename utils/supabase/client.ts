import type { PostgrestMaybeSingleResponse } from '@supabase/postgrest-js/src/types';
import { signOut } from '@/utils/supabase/actions';
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
  const client = createClientComponentClient();
  const {
    error,
    data: { user }
  } = await client.auth.getUser();
  if (error || !user) {
    await signOut();
  }
  return user;
}

export async function getFreshUser(user: User | null) {
  return user ?? (await refreshSession())!;
}
