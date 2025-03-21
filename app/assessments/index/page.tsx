'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DRDPAssessment } from '@/types/drdp';

const AssessmentsIndexPage = () => {
    const [assessments, setAssessments] = useState<DRDPAssessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/drdp/assessments');

                if (!response.ok) {
                    throw new Error('Failed to fetch assessments');
                }

                const data = await response.json();
                setAssessments(data);
            } catch (err) {
                console.error('Error fetching assessments:', err);
                setError('Failed to load assessments. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

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
            <div className="flex justify-center items-center p-12">
                <div className="w-8 h-8 border-4 border-t-blue-600 border-b-blue-600 rounded-full animate-spin"></div>
                <span className="ml-2">Loading assessments...</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">DRDP Assessments</h1>
                <Link href="/assessments/create" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Create New Assessment
                </Link>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-500 rounded-md mb-4">
                    {error}
                </div>
            )}

            {assessments.length === 0 && !loading && !error ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-medium text-gray-600">No assessments found</h3>
                    <p className="mt-2 text-gray-500">Get started by creating your first assessment</p>
                    <Link href="/assessments/create" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block">
                        Create New Assessment
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {assessments.map((assessment) => (
                                <tr key={assessment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {assessment.student ? (
                                            <div>
                                                <div className="font-medium">{assessment.student.first_name} {assessment.student.last_name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {assessment.student.grade && `Grade: ${assessment.student.grade}`}
                                                    {assessment.student.class && ` | Class: ${assessment.student.class}`}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">Unknown Student</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(assessment.assessment_date)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{assessment.assessment_period}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${assessment.status === 'complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {assessment.status === 'complete' ? 'Complete' : 'In Progress'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link href={`/assessments/${assessment.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AssessmentsIndexPage; 