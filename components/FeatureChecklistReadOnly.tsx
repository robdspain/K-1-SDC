"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase-browser';

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

export default function FeatureChecklistReadOnly() {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    // Fetch features from database
    useEffect(() => {
        const fetchFeatures = async () => {
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

        fetchFeatures();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Group features by status
    const implementedFeatures = features.filter(f => f.status === 'yes');
    const plannedFeatures = features.filter(f => f.status === 'planned');
    const notImplementedFeatures = features.filter(f => f.status === 'no');

    return (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">DRDP Feature Implementation Checklist</h2>
                <p className="text-indigo-100 text-sm mt-1">
                    Current status of DRDP assessment features
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="p-6">
                <div className="mb-6 flex flex-wrap gap-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                        <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                        <span>Implemented: {implementedFeatures.length}</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                        <span className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></span>
                        <span>Planned: {plannedFeatures.length}</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800">
                        <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
                        <span>Not Implemented: {notImplementedFeatures.length}</span>
                    </div>
                </div>

                {features.length === 0 ? (
                    <p className="text-gray-500 italic">No features available.</p>
                ) : (
                    <div className="space-y-8">
                        {/* Implemented Features */}
                        <div>
                            <h3 className="text-lg font-medium text-green-700 mb-3">Implemented Features</h3>
                            {implementedFeatures.length === 0 ? (
                                <p className="text-gray-500 italic">No implemented features yet.</p>
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
                                                    Notes
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {implementedFeatures.map((feature) => (
                                                <tr key={feature.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {feature.title}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {feature.description}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {feature.notes}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Planned Features */}
                        <div>
                            <h3 className="text-lg font-medium text-yellow-700 mb-3">Planned for Future</h3>
                            {plannedFeatures.length === 0 ? (
                                <p className="text-gray-500 italic">No planned features yet.</p>
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
                                                    Notes
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {plannedFeatures.map((feature) => (
                                                <tr key={feature.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {feature.title}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {feature.description}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {feature.notes}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Not Implemented Features */}
                        <div>
                            <h3 className="text-lg font-medium text-red-700 mb-3">Not Implemented</h3>
                            {notImplementedFeatures.length === 0 ? (
                                <p className="text-gray-500 italic">No unimplemented features.</p>
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
                                                    Notes
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {notImplementedFeatures.map((feature) => (
                                                <tr key={feature.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {feature.title}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {feature.description}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {feature.notes}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 