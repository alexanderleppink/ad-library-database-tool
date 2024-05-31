'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function refreshAuth() {
  const client = createClient();
  await client.auth.getUser();
  const {
    error,
    data: { session }
  } = await client.auth.getSession();
  if (error || !session) {
    await client.auth.signOut();
    redirect('/login');
  }
  return session;
}
