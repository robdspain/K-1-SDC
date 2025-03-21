'use client';

import React, { useState, useEffect } from 'react';
import { DRDPDomain, DRDPMeasure } from '@/types/drdp';
import Link from 'next/link';

interface DomainListProps {
    assessmentId?: string;
    onSelectMeasure?: (measureId: string) => void;
    showRatingStatus?: boolean;
    ratedMeasures?: string[];
}

const DomainList: React.FC<DomainListProps> = ({
    assessmentId,
    onSelectMeasure,
    showRatingStatus = false,
    ratedMeasures = []
}) => {
    const [domains, setDomains] = useState<DRDPDomain[]>([]);
    const [openDomains, setOpenDomains] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/drdp/domains');

                if (!response.ok) {
                    throw new Error('Failed to fetch domains');
                }

                const data = await response.json();
                setDomains(data);

                // Initialize all domains as closed
                const initialOpenState: Record<string, boolean> = {};
                data.forEach((domain: DRDPDomain) => {
                    initialOpenState[domain.id] = false;
                });
                setOpenDomains(initialOpenState);
            } catch (err) {
                console.error('Error fetching domains:', err);
                setError('Failed to load domains. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDomains();
    }, []);

    const toggleDomain = (domainId: string) => {
        setOpenDomains(prev => ({
            ...prev,
            [domainId]: !prev[domainId]
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="w-8 h-8 border-4 border-t-blue-600 border-b-blue-600 rounded-full animate-spin"></div>
                <span className="ml-2">Loading domains...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-500 rounded-md">
                {error}
            </div>
        );
    }

    if (domains.length === 0) {
        return (
            <div className="p-4 bg-gray-50 text-gray-500 rounded-md">
                No domains found.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {domains.map(domain => (
                <div key={domain.id} className="border rounded-md">
                    <button
                        onClick={() => toggleDomain(domain.id)}
                        className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-gray-50"
                    >
                        <div>
                            <span className="mr-2">{domain.name}</span>
                            {showRatingStatus && domain.measures && (
                                <span className="text-sm text-gray-500">
                                    ({domain.measures.filter(measure => ratedMeasures.includes(measure.id)).length} of {domain.measures.length} rated)
                                </span>
                            )}
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transform transition-transform ${openDomains[domain.id] ? 'rotate-180' : ''}`}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    {openDomains[domain.id] && domain.measures && (
                        <div className="p-4 pt-0 border-t">
                            <ul className="space-y-2">
                                {domain.measures.map(measure => (
                                    <li key={measure.id} className="pl-4 py-2 border-l-2 border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-medium">{measure.code} - {measure.name}</div>
                                                <div className="text-sm text-gray-500 mt-1">{measure.description}</div>
                                            </div>

                                            {showRatingStatus && (
                                                <div>
                                                    {ratedMeasures.includes(measure.id) ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Rated
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            Not Rated
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {onSelectMeasure && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelectMeasure(measure.id);
                                                    }}
                                                    className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                                >
                                                    {ratedMeasures.includes(measure.id) ? 'Edit Rating' : 'Rate Measure'}
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

interface MeasureItemProps {
    measure: DRDPMeasure;
    assessmentId?: string;
    onSelect?: (measureId: string) => void;
    isRated?: boolean;
}

const MeasureItem: React.FC<MeasureItemProps> = ({
    measure,
    assessmentId,
    onSelect,
    isRated = false
}) => {
    const handleClick = () => {
        if (onSelect) {
            onSelect(measure.id);
        }
    };

    const content = (
        <div className={`p-4 border rounded-md cursor-pointer hover:shadow-md transition-shadow ${isRated ? 'border-green-300 bg-green-50' : ''}`}>
            <div className="flex justify-between items-start">
                <h4 className="font-medium">
                    {measure.code}: {measure.name}
                </h4>
                {isRated && (
                    <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                        Rated
                    </span>
                )}
            </div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {measure.description}
            </p>
            {onSelect && (
                <button
                    className="mt-2 w-full py-2 text-blue-600 hover:text-blue-800 text-center"
                    onClick={handleClick}
                >
                    {isRated ? 'Edit Rating' : 'Add Rating'}
                </button>
            )}
        </div>
    );

    if (assessmentId && !onSelect) {
        return (
            <Link href={`/assessments/${assessmentId}/measures/${measure.id}`}>
                {content}
            </Link>
        );
    }

    return (
        <div onClick={handleClick}>
            {content}
        </div>
    );
};

export default DomainList; 