'use client';

import React, { useEffect, useState } from 'react';
import { DRDPMeasure, DRDPDevelopmentalLevel, DRDPRating } from '@/types/drdp';

interface RatingFormProps {
    measureId: string;
    assessmentId: string;
    existingRating?: DRDPRating;
    onSave?: () => void;
    onCancel?: () => void;
}

const RatingForm: React.FC<RatingFormProps> = ({
    measureId,
    assessmentId,
    existingRating,
    onSave,
    onCancel
}) => {
    const [measure, setMeasure] = useState<DRDPMeasure | null>(null);
    const [levels, setLevels] = useState<DRDPDevelopmentalLevel[]>([]);
    const [selectedLevelId, setSelectedLevelId] = useState<string>(existingRating?.developmental_level_id || '');
    const [observationNotes, setObservationNotes] = useState<string>(existingRating?.observation_notes || '');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch measure details
                const measureResponse = await fetch(`/api/drdp/domains`);
                if (!measureResponse.ok) {
                    throw new Error('Failed to fetch measure');
                }

                const domainsData = await measureResponse.json();
                let foundMeasure: DRDPMeasure | null = null;

                // Find the specific measure in the domains data
                for (const domain of domainsData) {
                    if (domain.measures) {
                        const measure = domain.measures.find((m: DRDPMeasure) => m.id === measureId);
                        if (measure) {
                            foundMeasure = measure;
                            break;
                        }
                    }
                }

                if (!foundMeasure) {
                    throw new Error('Measure not found');
                }

                setMeasure(foundMeasure);

                // Fetch developmental levels
                const levelsResponse = await fetch('/api/drdp/levels');
                if (!levelsResponse.ok) {
                    throw new Error('Failed to fetch developmental levels');
                }

                const levelsData = await levelsResponse.json();
                setLevels(levelsData);
            } catch (err) {
                console.error('Error loading rating data:', err);
                setError('Failed to load rating data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [measureId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedLevelId) {
            setError('Please select a developmental level');
            return;
        }

        try {
            setSaving(true);

            const response = await fetch('/api/drdp/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    assessment_id: assessmentId,
                    measure_id: measureId,
                    developmental_level_id: selectedLevelId,
                    observation_notes: observationNotes
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save rating');
            }

            if (onSave) {
                onSave();
            }
        } catch (err) {
            console.error('Error saving rating:', err);
            setError('Failed to save rating. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="w-8 h-8 border-4 border-t-blue-600 border-b-blue-600 rounded-full animate-spin mx-auto"></div>
                <p className="mt-2">Loading...</p>
            </div>
        );
    }

    if (error && !loading) {
        return (
            <div className="p-4 bg-red-50 text-red-500 rounded-md">
                <p>{error}</p>
                <button
                    onClick={onCancel}
                    className="mt-4 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!measure) {
        return (
            <div className="p-4 bg-red-50 text-red-500 rounded-md">
                <p>Measure not found</p>
                <button
                    onClick={onCancel}
                    className="mt-4 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-md shadow-sm border">
            <div className="mb-4">
                <h3 className="text-lg font-medium">{measure.code}: {measure.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{measure.description}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <h4 className="font-medium mb-2">Select Developmental Level</h4>
                    <div className="space-y-2">
                        {levels.map((level) => (
                            <label
                                key={level.id}
                                className={`block p-3 border rounded-md cursor-pointer hover:bg-gray-50 
                  ${selectedLevelId === level.id ? 'border-blue-500 bg-blue-50' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="developmentalLevel"
                                    value={level.id}
                                    checked={selectedLevelId === level.id}
                                    onChange={() => setSelectedLevelId(level.id)}
                                    className="sr-only"
                                />
                                <div className="flex flex-col">
                                    <span className="font-medium">{level.name}</span>
                                    <span className="text-xs text-gray-500">{level.description}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-2" htmlFor="observationNotes">
                        Observation Notes
                    </label>
                    <textarea
                        id="observationNotes"
                        value={observationNotes}
                        onChange={(e) => setObservationNotes(e.target.value)}
                        placeholder="Enter observation notes here..."
                        className="w-full p-2 border rounded-md"
                        rows={4}
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Rating'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RatingForm; 