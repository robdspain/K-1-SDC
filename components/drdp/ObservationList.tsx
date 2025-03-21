'use client';

import React, { useEffect, useState } from 'react';
import { DRDPObservation } from '@/types/drdp';

interface ObservationListProps {
    ratingId: string;
}

const ObservationList: React.FC<ObservationListProps> = ({ ratingId }) => {
    const [observations, setObservations] = useState<DRDPObservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newObservation, setNewObservation] = useState({
        observation_date: new Date().toISOString().split('T')[0],
        observation_text: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchObservations = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/drdp/observations?rating_id=${ratingId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch observations');
                }

                const data = await response.json();
                setObservations(data);
            } catch (err) {
                console.error('Error fetching observations:', err);
                setError('Failed to load observations');
            } finally {
                setLoading(false);
            }
        };

        fetchObservations();
    }, [ratingId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newObservation.observation_text.trim()) {
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch('/api/drdp/observations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    rating_id: ratingId,
                    observation_date: newObservation.observation_date,
                    observation_text: newObservation.observation_text
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add observation');
            }

            const data = await response.json();
            setObservations([data, ...observations]);
            setNewObservation({
                observation_date: new Date().toISOString().split('T')[0],
                observation_text: ''
            });
            setShowAddForm(false);
        } catch (err) {
            console.error('Error adding observation:', err);
            setError('Failed to add observation');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteObservation = async (id: string) => {
        if (!confirm('Are you sure you want to delete this observation?')) {
            return;
        }

        try {
            const response = await fetch(`/api/drdp/observations/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete observation');
            }

            setObservations(observations.filter(obs => obs.id !== id));
        } catch (err) {
            console.error('Error deleting observation:', err);
            setError('Failed to delete observation');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="w-6 h-6 border-4 border-t-blue-600 border-b-blue-600 rounded-full animate-spin mx-auto"></div>
                <p className="mt-2 text-sm">Loading observations...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Observations</h3>
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                        Add Observation
                    </button>
                )}
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
                    {error}
                </div>
            )}

            {showAddForm && (
                <div className="border rounded-md p-4 bg-gray-50">
                    <h4 className="font-medium mb-3">Add New Observation</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1" htmlFor="observationDate">
                                Observation Date
                            </label>
                            <input
                                type="date"
                                id="observationDate"
                                value={newObservation.observation_date}
                                onChange={(e) => setNewObservation({ ...newObservation, observation_date: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1" htmlFor="observationText">
                                Observation
                            </label>
                            <textarea
                                id="observationText"
                                value={newObservation.observation_text}
                                onChange={(e) => setNewObservation({ ...newObservation, observation_text: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                rows={4}
                                placeholder="Describe your observation here..."
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-3 py-1.5 border rounded-md hover:bg-gray-100 text-sm"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Observation'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {observations.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                    No observations recorded yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {observations.map((observation) => (
                        <div key={observation.id} className="border rounded-md p-3 hover:shadow-sm">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-gray-500">
                                    {formatDate(observation.observation_date)}
                                </span>
                                <button
                                    onClick={() => handleDeleteObservation(observation.id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                    aria-label="Delete observation"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="mt-2 text-sm whitespace-pre-wrap">{observation.observation_text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ObservationList; 