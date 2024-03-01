'use server';

import { createClient } from '@/utils/supabase/server';

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  console.info('User logged out');
}
