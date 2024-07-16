'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signOut() {
  const client = createClient();
  await client.auth.signOut();
  redirect('/login');
}
