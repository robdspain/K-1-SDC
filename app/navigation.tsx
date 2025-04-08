"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { createClient } from '@/utils/supabase-browser';

const Navigation = () => {
    const pathname = usePathname();
    const { user, isLoading } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Check if user is admin from Supabase when Auth0 user loads
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user?.email) return;

            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('email', user.email)
                    .single();

                if (error) throw error;

                setIsAdmin(data?.role === 'admin');
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
    }, [user?.email]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Dashboard', href: '/dashboard/features' },
        { name: 'Students', href: '/students' },
        { name: 'Assessments', href: '/assessments' },
    ];

    // Add admin link if user is admin
    if (isAdmin) {
        navItems.push({ name: 'Admin', href: '/admin/features' });
    }

    const isActiveLink = (href: string) => {
        if (href === '/') {
            return pathname === href;
        }
        return pathname?.startsWith(href);
    };

    return (
        <nav className="bg-indigo-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-white font-bold text-xl">TK-1-SDC</span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActiveLink(item.href)
                                                ? 'bg-indigo-700 text-white'
                                                : 'text-indigo-200 hover:bg-indigo-500 hover:text-white'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {isLoading ? (
                                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : user ? (
                                <div className="flex items-center">
                                    <Link
                                        href="/profile"
                                        className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/api/auth/logout"
                                        className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    href="/api/auth/login"
                                    className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="bg-indigo-600 inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            <svg
                                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveLink(item.href)
                                    ? 'bg-indigo-700 text-white'
                                    : 'text-indigo-200 hover:bg-indigo-500 hover:text-white'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="pt-4 pb-3 border-t border-indigo-700">
                    <div className="flex items-center px-5">
                        {user && user.picture && (
                            <div className="flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src={user.picture} alt="" />
                            </div>
                        )}
                        <div className="ml-3">
                            {user && (
                                <>
                                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                    <div className="text-sm font-medium leading-none text-indigo-200 mt-1">{user.email}</div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="mt-3 px-2 space-y-1">
                        {isLoading ? (
                            <div className="px-3 py-2">
                                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-white hover:bg-indigo-500"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/api/auth/logout"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-white hover:bg-indigo-500"
                                >
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/api/auth/login"
                                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-white hover:bg-indigo-500"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 