import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import React from 'react';
import Navigation from '@/components/Navigation';

async function AppLayout({ children }: PropsWithChildren) {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <>
      <Navigation />
      <div className="gap-6 flex flex-col items-center p-4 md:p-8">{children}</div>
    </>
  );
}

export default AppLayout;
