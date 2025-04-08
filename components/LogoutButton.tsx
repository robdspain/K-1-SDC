"use client";

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase-browser';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    setLoading(true);

    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
    >
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  );
} 