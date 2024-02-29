import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

async function AppLayout({ children }: PropsWithChildren) {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return <>{children}</>;
}

export default AppLayout;
