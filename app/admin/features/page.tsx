'use client';

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import FeatureChecklistAdmin from '@/components/FeatureChecklistAdmin';

export default function AdminFeaturesPage() {
    const { user, isLoading } = useUser();
    const router = useRouter();

    // Redirect if not logged in
    React.useEffect(() => {
        if (!isLoading && !user) {
            router.push('/api/auth/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        return null; // We'll redirect in the useEffect
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Admin Feature Management</h1>
                <p className="text-gray-600 mt-2">
                    Manage feature checklist items and their status here. Only accessible to admin users.
                </p>
            </div>

            <FeatureChecklistAdmin />
        </div>
    );
} 