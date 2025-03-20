import { createClient } from '@/utils/supabase-server';
import LogoutButton from '@/components/LogoutButton';
import React from 'react';

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Supabase Auth with Next.js</h1>

        {user ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">You are logged in!</h2>
            <div className="mb-4">
              <p className="text-gray-600 mb-1">Email:</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-1">User ID:</p>
              <p className="font-semibold">{user.id}</p>
            </div>

            <LogoutButton />
          </div>
        ) : (
          <div>
            <p className="mb-4">You are not logged in.</p>
            <a
              href="/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Go to Login
            </a>
          </div>
        )}
      </main>
    </div>
  );
} 