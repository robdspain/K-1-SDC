'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { createClient } from '@/utils/supabase-browser';

type SupabaseProfile = {
    id: string;
    email: string;
    name: string;
    role: string;
    created_at: string;
    updated_at: string;
};

export default function ProfilePage() {
    const { user, error, isLoading } = useUser();
    const [supabaseProfile, setSupabaseProfile] = useState<SupabaseProfile | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);

    // Fetch Supabase profile when Auth0 user loads
    useEffect(() => {
        if (user?.email) {
            const fetchSupabaseProfile = async () => {
                setProfileLoading(true);
                setProfileError(null);

                try {
                    const supabase = createClient();
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('email', user.email)
                        .single();

                    if (error) throw error;

                    setSupabaseProfile(data);
                    setIsAdmin(data?.role === 'admin');
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    setProfileError('Failed to load profile data from Supabase');
                } finally {
                    setProfileLoading(false);
                }
            };

            fetchSupabaseProfile();
        }
    }, [user?.email]);

    if (isLoading || profileLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>{error.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-10">
                <h1 className="text-2xl font-bold mb-4">Profile</h1>
                <p className="mb-4">You need to be logged in to view your profile.</p>
                <Link
                    href="/api/auth/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Login
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
                <h1 className="text-xl font-bold text-white">User Profile</h1>
            </div>

            <div className="p-6">
                <div className="flex items-center mb-6">
                    {user.picture && (
                        <img
                            src={user.picture}
                            alt={user.name || 'User'}
                            className="h-16 w-16 rounded-full mr-4"
                        />
                    )}
                    <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                        {isAdmin && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                                Admin
                            </span>
                        )}
                    </div>
                </div>

                {profileError && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">{profileError}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-medium mb-2">User Information</h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">User ID</dt>
                            <dd className="mt-1 text-sm text-gray-900">{user.sub}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {user.email_verified ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Not Verified
                                    </span>
                                )}
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Supabase Profile Status</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {supabaseProfile ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Synchronized
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Not Synchronized
                                    </span>
                                )}
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {user.updated_at && new Date(user.updated_at).toLocaleString()}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="mt-6 flex space-x-3">
                    <Link
                        href="/dashboard/features"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Dashboard
                    </Link>
                    {isAdmin && (
                        <Link
                            href="/admin/features"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Admin Panel
                        </Link>
                    )}
                    <Link
                        href="/api/auth/logout"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Logout
                    </Link>
                </div>
            </div>
        </div>
    );
} 