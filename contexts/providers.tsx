'use client';

import React from 'react';
import { Flowbite } from 'flowbite-react';
import { customTheme } from '@/utils/flowbite/flowbiteTheme';

function Providers({ children }: React.PropsWithChildren) {
  return <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>;
}

export default Providers;
