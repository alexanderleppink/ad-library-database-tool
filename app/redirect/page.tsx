'use client';

import React, { useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

function Page() {
  const user = useUser();
  console.log('user', user);
  useEffect(() => {
    const supabase = createClientComponentClient<Database>();
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('event', event);
      console.log('session', session);
    });
  }, []);

  return <div>Invited!</div>;
}

export default Page;
