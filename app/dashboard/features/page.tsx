"use client";

import React from 'react';
import FeatureChecklistAdmin from '@/components/FeatureChecklistAdmin';
import FeatureChecklistReadOnly from '@/components/FeatureChecklistReadOnly';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function FeaturesPage() {
    const { user, error, isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="text-center py-10">
                    <h1 className="text-2xl font-bold mb-4">DRDP Features Management</h1>
                    <p className="mb-4">You need to be logged in to view this page.</p>
                    <Link
                        href="/api/auth/login?returnTo=/dashboard/features"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    // We will handle the admin check inside the FeatureChecklistAdmin component
    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-8">DRDP Features Management</h1>

            {/* The components will handle admin vs non-admin views internally */}
            <div className="space-y-8">
                <FeatureChecklistAdmin />
            </div>
        </div>
    );
} 