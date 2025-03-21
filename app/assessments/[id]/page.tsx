'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DRDPAssessment, DRDPRating } from '@/types/drdp';
import DomainList from '@/components/drdp/DomainList';
import RatingForm from '@/components/drdp/RatingForm';

const AssessmentDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const assessmentId = params?.id as string;

    if (!assessmentId) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <Link href="/assessments" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Back to Assessments
                </Link>
                <div className="p-4 bg-red-50 text-red-500 rounded-md">
                    Assessment ID is required
                </div>
            </div>
        );
    }

    const [assessment, setAssessment] = useState<DRDPAssessment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMeasureId, setSelectedMeasureId] = useState<string | null>(null);
    const [ratedMeasureIds, setRatedMeasureIds] = useState<string[]>([]);
    const [deletingAssessment, setDeletingAssessment] = useState(false);

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/drdp/assessments/${assessmentId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch assessment');
                }

                const data = await response.json();
                setAssessment(data);

                // Extract rated measure IDs
                if (data.ratings && Array.isArray(data.ratings)) {
                    setRatedMeasureIds(data.ratings.map((rating: DRDPRating) => rating.measure_id));
                }
            } catch (err) {
                console.error('Error fetching assessment:', err);
                setError('Failed to load assessment data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAssessment();
    }, [assessmentId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleMeasureSelect = (measureId: string) => {
        setSelectedMeasureId(measureId);
    };

    const handleRatingSaved = async () => {
        // Refetch assessment to get updated ratings
        try {
            const response = await fetch(`/api/drdp/assessments/${assessmentId}`);

            if (!response.ok) {
                throw new Error('Failed to refresh assessment data');
            }

            const data = await response.json();
            setAssessment(data);

            // Update rated measure IDs
            if (data.ratings && Array.isArray(data.ratings)) {
                setRatedMeasureIds(data.ratings.map((rating: DRDPRating) => rating.measure_id));
            }

            // Clear selected measure
            setSelectedMeasureId(null);
        } catch (err) {
            console.error('Error refreshing assessment data:', err);
            setError('Failed to refresh assessment data after saving rating.');
        }
    };

    const handleDeleteAssessment = async () => {
        if (!confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
            return;
        }

        try {
            setDeletingAssessment(true);
            const response = await fetch(`/api/drdp/assessments/${assessmentId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete assessment');
            }

            router.push('/assessments');
        } catch (err) {
            console.error('Error deleting assessment:', err);
            setError('Failed to delete assessment. Please try again.');
            setDeletingAssessment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-12">
                <div className="w-8 h-8 border-4 border-t-blue-600 border-b-blue-600 rounded-full animate-spin"></div>
                <span className="ml-2">Loading assessment...</span>
            </div>
        );
    }

    if (error || !assessment) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <Link href="/assessments" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Back to Assessments
                </Link>
                <div className="p-4 bg-red-50 text-red-500 rounded-md">
                    {error || 'Assessment not found'}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <Link href="/assessments" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Back to Assessments
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Assessment for {assessment.student?.first_name} {assessment.student?.last_name}
                        </h1>
                        <div className="mt-1 text-gray-500">
                            {formatDate(assessment.assessment_date)} • {assessment.assessment_period} Period
                        </div>
                        {assessment.notes && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                                <strong>Notes:</strong> {assessment.notes}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleDeleteAssessment}
                        disabled={deletingAssessment}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                    >
                        {deletingAssessment ? 'Deleting...' : 'Delete Assessment'}
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <div className="bg-white p-4 rounded-md shadow-sm border">
                    <h2 className="text-lg font-medium mb-2">Progress</h2>
                    <div className="flex items-center mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${ratedMeasureIds.length > 0 ? (ratedMeasureIds.length / 10) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                            {ratedMeasureIds.length} of 10 measures rated
                        </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                        Rating status:
                        <span className={`ml-2 px-2 py-0.5 rounded-full ${assessment.status === 'complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {assessment.status === 'complete' ? 'Complete' : 'In Progress'}
                        </span>
                    </div>

                    {assessment.status !== 'complete' && ratedMeasureIds.length > 0 && (
                        <button
                            className="px-3 py-1.5 mt-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            onClick={async () => {
                                try {
                                    const response = await fetch(`/api/drdp/assessments/${assessmentId}`, {
                                        method: 'PATCH',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            status: 'complete'
                                        })
                                    });

                                    if (!response.ok) {
                                        throw new Error('Failed to mark assessment as complete');
                                    }

                                    const data = await response.json();
                                    setAssessment({
                                        ...assessment,
                                        status: data.status
                                    });
                                } catch (err) {
                                    console.error('Error marking assessment as complete:', err);
                                    setError('Failed to mark assessment as complete.');
                                }
                            }}
                        >
                            Mark as Complete
                        </button>
                    )}
                </div>
            </div>

            {selectedMeasureId ? (
                <div className="bg-white rounded-md shadow-sm border p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium">Rate Measure</h2>
                        <button
                            onClick={() => setSelectedMeasureId(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    <RatingForm
                        measureId={selectedMeasureId}
                        assessmentId={assessmentId}
                        existingRating={assessment.ratings?.find(
                            (rating: DRDPRating) => rating.measure_id === selectedMeasureId
                        )}
                        onSave={handleRatingSaved}
                        onCancel={() => setSelectedMeasureId(null)}
                    />
                </div>
            ) : (
                <div className="bg-white rounded-md shadow-sm border">
                    <div className="border-b p-4">
                        <h2 className="text-lg font-medium">Domains and Measures</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Select a measure to add or edit its rating
                        </p>
                    </div>
                    <div className="p-4">
                        <DomainList
                            assessmentId={assessmentId}
                            onSelectMeasure={handleMeasureSelect}
                            showRatingStatus={true}
                            ratedMeasures={ratedMeasureIds}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssessmentDetailPage; 