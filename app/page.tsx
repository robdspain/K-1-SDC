import React from 'react';
import { createClient } from '@/utils/supabase-server';
import LogoutButton from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let user = null;
  let error = null;

  try {
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error:', authError);
      error = 'Authentication error';
    } else {
      user = userData.user;
    }
  } catch (err) {
    console.error('Error loading user:', err);
    error = 'Error loading user data';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Supabase Auth + Next.js App Router</h1>

        <div className="bg-white dark:bg-black shadow-md p-6 rounded-md w-full max-w-lg">
          {error ? (
            <div className="text-red-500 mb-4">
              <p>{error}</p>
              <a
                href="/login"
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </a>
            </div>
          ) : user ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Welcome!</h2>
              <p>You are signed in as: {user.email}</p>
              <LogoutButton />
            </div>
          ) : (
            <div className="space-y-4">
              <p>You are not signed in</p>
              <a
                href="/login"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 