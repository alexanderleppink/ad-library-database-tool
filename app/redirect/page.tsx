'use client';

import React from 'react';
import { useUser } from '@supabase/auth-helpers-react';

function Page() {
  const user = useUser();
  console.log('user', user);

  return <div>Invited!</div>;
}

export default Page;
