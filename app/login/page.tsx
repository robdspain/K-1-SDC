"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase-browser';
import { useRouter } from 'next/navigation';

// Force dynamic to avoid static rendering
export const dynamic = 'force-dynamic';
// Prevent static optimization
export const revalidate = 0;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Only create client on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkUser();
  }, [router, isClient]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isClient) return;

    setLoading(true);
    setMessage('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Use router instead of window.location for better Next.js integration
      router.push('/');
      router.refresh();
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isClient) return;

    setLoading(true);
    setMessage('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      setMessage('Check your email for the confirmation link');
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-6">Login to Your Account</h1>

        {message && (
          <div className="bg-blue-50 border border-blue-500 text-blue-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{message}</p>
          </div>
        )}

        <form className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <div className="flex justify-center">
            <a
              href="/api/auth/login"
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center w-full"
            >
              Login with Auth0
            </a>
          </div>
        </form>
      </main>
    </div>
  );
} 