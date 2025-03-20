"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase-browser';
import { useUser } from '@auth0/nextjs-auth0/client';

type FeatureStatus = 'yes' | 'no' | 'planned';

interface Feature {
    id: string;
    title: string;
    description: string;
    status: FeatureStatus;
    notes: string;
    created_at?: string;
    updated_at?: string;
}

export default function FeatureChecklistAdmin() {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminChecking, setAdminChecking] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // New feature form state
    const [newFeature, setNewFeature] = useState({
        title: '',
        description: '',
        status: 'planned' as FeatureStatus,
        notes: ''
    });

    const supabase = createClient();
    const { user, isLoading: userLoading } = useUser();

    // Check if user is admin
    useEffect(() => {
        const checkIfAdmin = async () => {
            if (userLoading) return;
            setAdminChecking(true);

            if (!user) {
                setIsAdmin(false);
                setAdminChecking(false);
                return;
            }

            // Check for admin role in Auth0 user metadata
            // For Auth0, roles are typically in the user.roles or a custom namespace
            // This is a simplified example, adjust according to your Auth0 setup
            const userMetadata = user as any; // Type assertion for metadata access
            if (userMetadata &&
                (userMetadata.role === 'admin' ||
                    (userMetadata[`${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/roles`] &&
                        Array.isArray(userMetadata[`${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/roles`]) &&
                        userMetadata[`${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/roles`].includes('admin')))) {
                setIsAdmin(true);
            } else {
                // Fallback to checking Supabase profiles table for backward compatibility
                const { data: { user: supabaseUser } } = await supabase.auth.getUser();

                if (!supabaseUser) {
                    setIsAdmin(false);
                    setAdminChecking(false);
                    return;
                }

                // Check if user is admin by querying the profiles table
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', supabaseUser.id)
                    .single();

                if (error) {
                    console.error("Error checking admin status:", error);
                    setIsAdmin(false);
                } else if (data && data.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            }

            setAdminChecking(false);
        };

        if (!userLoading) {
            checkIfAdmin();
        }
    }, [user, userLoading]);

    // Fetch features from database
    useEffect(() => {
        const fetchFeatures = async () => {
            if (!isAdmin) return;

            setLoading(true);

            const { data, error } = await supabase
                .from('features')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching features:", error);
                setError("Failed to load features");
            } else {
                setFeatures(data || []);
                setError(null);
            }

            setLoading(false);
        };

        if (!adminChecking && isAdmin) {
            fetchFeatures();
        }
    }, [isAdmin, adminChecking]);

    // Handle form input changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setNewFeature(prev => ({ ...prev, [name]: value }));
    };

    // Add new feature
    const handleAddFeature = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newFeature.title.trim()) {
            setError("Feature title is required");
            return;
        }

        try {
            const { data, error } = await supabase
                .from('features')
                .insert([
                    {
                        title: newFeature.title.trim(),
                        description: newFeature.description.trim(),
                        status: newFeature.status,
                        notes: newFeature.notes.trim()
                    }
                ])
                .select();

            if (error) throw error;

            setFeatures(prev => [...(data || []), ...prev]);
            setNewFeature({
                title: '',
                description: '',
                status: 'planned',
                notes: ''
            });

            setSuccessMessage("Feature added successfully");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error("Error adding feature:", err);
            setError("Failed to add feature");
        }
    };

    // Update feature status
    const handleStatusChange = async (id: string, newStatus: FeatureStatus) => {
        try {
            const { error } = await supabase
                .from('features')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setFeatures(prev =>
                prev.map(feature =>
                    feature.id === id ? { ...feature, status: newStatus } : feature
                )
            );

            setSuccessMessage("Feature status updated");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error("Error updating feature status:", err);
            setError("Failed to update feature status");
        }
    };

    // Delete feature
    const handleDeleteFeature = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this feature?")) {
            return;
        }

        try {
            const { error } = await supabase
                .from('features')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setFeatures(prev => prev.filter(feature => feature.id !== id));

            setSuccessMessage("Feature deleted successfully");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error("Error deleting feature:", err);
            setError("Failed to delete feature");
        }
    };

    // Update feature notes
    const handleNotesChange = async (id: string, notes: string) => {
        try {
            const { error } = await supabase
                .from('features')
                .update({ notes })
                .eq('id', id);

            if (error) throw error;

            setFeatures(prev =>
                prev.map(feature =>
                    feature.id === id ? { ...feature, notes } : feature
                )
            );

            setSuccessMessage("Notes updated");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error("Error updating notes:", err);
            setError("Failed to update notes");
        }
    };

    if (userLoading || adminChecking) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>
                                You must be an administrator to access this feature.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">DRDP Feature Implementation Checklist - Admin</h2>
                <p className="text-indigo-100 text-sm mt-1">
                    Manage implementation status of DRDP assessment features
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 m-4">
                    <p className="text-green-700">{successMessage}</p>
                </div>
            )}

            <div className="p-6">
                {/* Add new feature form */}
                <div className="mb-8 bg-gray-50 p-4 rounded-lg shadow-inner">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Feature</h3>
                    <form onSubmit={handleAddFeature}>
                        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                            <div className="sm:col-span-2">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Feature Title*
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={newFeature.title}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    value={newFeature.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={newFeature.status}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="yes">Implemented (Yes)</option>
                                    <option value="no">Not Implemented (No)</option>
                                    <option value="planned">Planned for Future</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                    Notes
                                </label>
                                <input
                                    type="text"
                                    name="notes"
                                    id="notes"
                                    value={newFeature.notes}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add Feature
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Features list */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : features.length === 0 ? (
                    <p className="text-gray-500 italic">No features available. Add your first feature above.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Feature
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Notes
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {features.map((feature) => (
                                    <tr key={feature.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {feature.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {feature.description}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <select
                                                value={feature.status}
                                                onChange={(e) => handleStatusChange(feature.id, e.target.value as FeatureStatus)}
                                                className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                                                    ${feature.status === 'yes' ? 'bg-green-50 text-green-800' :
                                                        feature.status === 'no' ? 'bg-red-50 text-red-800' :
                                                            'bg-yellow-50 text-yellow-800'}`}
                                            >
                                                <option value="yes">Implemented (Yes)</option>
                                                <option value="no">Not Implemented (No)</option>
                                                <option value="planned">Planned for Future</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <input
                                                type="text"
                                                value={feature.notes}
                                                onChange={(e) => handleNotesChange(feature.id, e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => handleDeleteFeature(feature.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
} 