'use client';

import React, { useState } from 'react';
import { Flowbite } from 'flowbite-react';
import { customTheme } from '@/utils/flowbite/flowbiteTheme';
import type { Session } from '@supabase/auth-helpers-react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

function Providers({ children, session }: React.PropsWithChildren<{ session: Session | null }>) {
  const [supabase] = useState(() => createPagesBrowserClient());
  return (
    <Flowbite theme={{ theme: customTheme }}>
      {/*the initial session is only needed that the client doesn't have to fetch the user itself*/}
      {/*but it uses the session data from the cookie*/}
      <SessionContextProvider supabaseClient={supabase} initialSession={session}>
        {children}
      </SessionContextProvider>
    </Flowbite>
  );
}

export default Providers;
