import type { CustomFlowbiteTheme } from 'flowbite-react';

export const customTheme = {
  navbar: {
    collapse: {
      base: 'w-full md:block md:w-auto',
      list: 'mt-4 flex flex-col md:mt-0 md:flex-row md:items-center md:space-x-8 md:text-sm md:font-medium',
      hidden: {
        on: 'hidden',
        off: ''
      }
    }
  }
} satisfies CustomFlowbiteTheme;
