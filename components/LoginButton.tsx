'use client';

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function LoginButton() {
    const { user, error, isLoading } = useUser();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (user) {
        return (
            <div className="space-x-2">
                <span className="text-sm text-gray-700">Welcome, {user.name}!</span>
                <Link
                    href="/api/auth/logout"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Logout
                </Link>
            </div>
        );
    }

    return (
        <Link
            href="/api/auth/login"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            Login
        </Link>
    );
} 