'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Student } from '@/types/drdp';

const CreateAssessmentPage = () => {
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        student_id: '',
        assessment_date: new Date().toISOString().split('T')[0],
        assessment_period: 'Fall',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/drdp/students');

                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }

                const data = await response.json();
                setStudents(data);
            } catch (err) {
                console.error('Error fetching students:', err);
                setError('Failed to load students. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student => {
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    const handleStudentSelect = (studentId: string) => {
        setFormData({
            ...formData,
            student_id: studentId
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.student_id) {
            setError('Please select a student');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const response = await fetch('/api/drdp/assessments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to create assessment');
            }

            const data = await response.json();
            router.push(`/assessments/${data.id}`);
        } catch (err) {
            console.error('Error creating assessment:', err);
            setError('Failed to create assessment. Please try again.');
            setSubmitting(false);
        }
    };

    const renderStudentList = () => {
        if (loading) {
            return (
                <div className="text-center p-4">
                    <div className="w-6 h-6 border-4 border-t-blue-600 border-b-blue-600 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-2">Loading students...</p>
                </div>
            );
        }

        if (filteredStudents.length === 0) {
            return (
                <div className="text-center p-4 text-gray-500">
                    {searchTerm ? 'No students found matching your search.' : 'No students available.'}
                </div>
            );
        }

        return (
            <div className="max-h-60 overflow-y-auto border rounded-md">
                {filteredStudents.map(student => (
                    <div
                        key={student.id}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${formData.student_id === student.id ? 'bg-blue-50' : ''}`}
                        onClick={() => handleStudentSelect(student.id)}
                    >
                        <div className="font-medium">{student.first_name} {student.last_name}</div>
                        <div className="text-sm text-gray-500">
                            {student.grade && `Grade: ${student.grade}`}
                            {student.class && ` | Class: ${student.class}`}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <Link href="/assessments" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Back to Assessments
                </Link>
                <h1 className="text-2xl font-bold">Create New Assessment</h1>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-500 rounded-md mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <h2 className="text-lg font-medium mb-4">Select Student</h2>

                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Search students by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        {renderStudentList()}

                        {formData.student_id && (
                            <div className="mt-2 text-sm text-green-600">
                                Student selected ✓
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <h2 className="text-lg font-medium mb-4">Assessment Details</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="assessment_date">
                                    Assessment Date
                                </label>
                                <input
                                    type="date"
                                    id="assessment_date"
                                    name="assessment_date"
                                    value={formData.assessment_date}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="assessment_period">
                                    Assessment Period
                                </label>
                                <select
                                    id="assessment_period"
                                    name="assessment_period"
                                    value={formData.assessment_period}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                >
                                    <option value="Fall">Fall</option>
                                    <option value="Winter">Winter</option>
                                    <option value="Spring">Spring</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="notes">
                                Notes (Optional)
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                                rows={3}
                                placeholder="Add any notes about this assessment..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <Link href="/assessments" className="px-4 py-2 border rounded-md hover:bg-gray-50 mr-2">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            disabled={submitting || !formData.student_id}
                        >
                            {submitting ? 'Creating...' : 'Create Assessment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAssessmentPage; 