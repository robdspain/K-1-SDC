import './globals.css';
import type { Metadata } from 'next';
import React from 'react';
import Navigation from './navigation';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'DRDP Assessment Tool',
  description: 'A tool for managing DRDP assessments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navigation />
          <main className="container mx-auto py-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
} 