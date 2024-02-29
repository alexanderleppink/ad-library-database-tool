import { GeistSans } from 'geist/font/sans';
import './globals.css';
import Providers from '@/contexts/providers';
import React from 'react';
import Navigation from '@/components/Navigation';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <Providers>
          <main className="min-h-screen flex flex-col">
            <Navigation />
            <div className="gap-6 flex flex-col items-center p-4 md:p-8 max-w-2xl mx-auto">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
