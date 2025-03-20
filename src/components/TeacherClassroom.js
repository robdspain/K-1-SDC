import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function TeacherClassroom() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const username = localStorage.getItem('user');

  // Sample data - in a real app, this would come from an API
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: 'K',
    notes: ''
  });
  const [activeTab, setActiveTab] = useState('students');
  const [assessmentStats, setAssessmentStats] = useState([]);

  // Load demo data
  useEffect(() => {
    // In a real app, these would be API calls based on the logged in teacher
    const demoClassroom = {
      id: '1',
      name: 'Room 101 - TK/K',
      grade: 'K',
      teacherId: '1', // Assuming teacher 1 is logged in
    };

    const demoStudents = [
      { id: '1', name: 'Sam Wilson', grade: 'K', notes: 'Needs support with letter recognition' },
      { id: '3', name: 'Casey Green', grade: 'K', notes: 'Working on phonological awareness' },
      { id: '4', name: 'Riley Thomas', grade: 'K', notes: 'Receptive language delays' }
    ];

    const demoUnassignedStudents = [
      { id: '6', name: 'Jamie Parker', grade: 'K', notes: 'New student' },
      { id: '7', name: 'Alex Kim', grade: 'K', notes: 'Transfer from Room 102' }
    ];

    const demoAssessmentStats = [
      { studentId: '1', completedAssessments: 2, pendingAssessments: 1, lastAssessmentDate: '2024-03-15' },
      { studentId: '3', completedAssessments: 1, pendingAssessments: 2, lastAssessmentDate: '2024-03-10' },
      { studentId: '4', completedAssessments: 3, pendingAssessments: 0, lastAssessmentDate: '2024-03-18' }
    ];

    setClassroom(demoClassroom);
    setStudents(demoStudents);
    setUnassignedStudents(demoUnassignedStudents);
    setAssessmentStats(demoAssessmentStats);
  }, []);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleAddExistingStudent = (student) => {
    setStudents([...students, student]);
    setUnassignedStudents(unassignedStudents.filter(s => s.id !== student.id));
    setShowAddStudentModal(false);
  };

  const handleRemoveStudent = (studentId) => {
    const studentToRemove = students.find(s => s.id === studentId);
    if (studentToRemove) {
      setStudents(students.filter(s => s.id !== studentId));
      setUnassignedStudents([...unassignedStudents, studentToRemove]);
    }
  };

  const handleCreateStudent = (e) => {
    e.preventDefault();
    const studentId = String(Date.now()); // Using timestamp as a simple ID generator
    const student = { ...newStudent, id: studentId };
    setStudents([...students, student]);
    setNewStudent({ name: '', grade: 'K', notes: '' });
    setShowCreateStudentModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const getStudentAssessmentStats = (studentId) => {
    return assessmentStats.find(stat => stat.studentId === studentId) || {
      completedAssessments: 0,
      pendingAssessments: 0,
      lastAssessmentDate: 'Never'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-indigo-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white font-bold text-xl">K-1 SDC Assessment</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-400"
              >
                Dashboard
              </Link>
              <Link
                to="/drdp-domains"
                className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-400"
              >
                DRDP Domains
              </Link>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-indigo-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Classroom Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{classroom?.name || 'My Classroom'}</h1>
              <p className="mt-1 text-gray-500">
                {classroom?.grade === 'K' ? 'Kindergarten' :
                  classroom?.grade === '1' ? 'First Grade' :
                    classroom?.grade === 'K-1' ? 'Kindergarten / First Grade' :
                      classroom?.grade === 'TK' ? 'Transitional Kindergarten' : 'Grade Level'} Classroom
              </p>
            </div>
            <div className="flex space-x-4">
              <span className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-sm font-medium">
                {students.length} Students
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('students')}
              className={`${activeTab === 'students'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab('assessments')}
              className={`${activeTab === 'assessments'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Assessment Overview
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`${activeTab === 'groups'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Learning Groups
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Students in {classroom?.name || 'My Classroom'}</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  disabled={unassignedStudents.length === 0}
                >
                  Add Existing Student
                </button>
                <button
                  onClick={() => setShowCreateStudentModal(true)}
                  className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50"
                >
                  Create New Student
                </button>
              </div>
            </div>

            {students.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No students in your classroom</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding students to your classroom.</p>
                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                    disabled={unassignedStudents.length === 0}
                  >
                    Add Existing Student
                  </button>
                  <button
                    onClick={() => setShowCreateStudentModal(true)}
                    className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50"
                  >
                    Create New Student
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => {
                  const stats = getStudentAssessmentStats(student.id);

                  return (
                    <div key={student.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="px-4 py-5 border-b border-gray-200 flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-500">Grade: {student.grade}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveStudent(student.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="px-4 py-4">
                        {student.notes && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700">Notes:</h4>
                            <p className="text-sm text-gray-500 mt-1">{student.notes}</p>
                          </div>
                        )}

                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Assessment Status:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-green-50 p-2 rounded-md">
                              <p className="text-xs text-gray-500">Completed</p>
                              <p className="text-lg font-semibold text-green-700">{stats.completedAssessments}</p>
                            </div>
                            <div className="bg-yellow-50 p-2 rounded-md">
                              <p className="text-xs text-gray-500">Pending</p>
                              <p className="text-lg font-semibold text-yellow-700">{stats.pendingAssessments}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Last assessment: {stats.lastAssessmentDate}
                          </p>
                        </div>

                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => navigate(`/dashboard?assess=${student.id}`)}
                            className="flex-1 bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-200"
                          >
                            Assess
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard?results=${student.id}`)}
                            className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-green-200"
                          >
                            View Results
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Assessment Overview Tab */}
        {activeTab === 'assessments' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Classroom Assessment Overview</h2>

            {students.length === 0 ? (
              <p className="text-gray-500">Add students to your classroom to view assessment data.</p>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Assessment Completion Status</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Assessment</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => {
                          const stats = getStudentAssessmentStats(student.id);

                          return (
                            <tr key={student.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {student.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {stats.completedAssessments}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {stats.pendingAssessments}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {stats.lastAssessmentDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => navigate(`/dashboard?assess=${student.id}`)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                  Assess
                                </button>
                                <button
                                  onClick={() => navigate(`/dashboard?results=${student.id}`)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Results
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Class Progress by Domain</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Language & Literacy Development</h4>
                      <div className="h-4 w-full bg-gray-200 rounded-full">
                        <div className="h-4 bg-indigo-600 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>68% Complete</span>
                        <span>17/25 Measures</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Cognition, Including Math and Science</h4>
                      <div className="h-4 w-full bg-gray-200 rounded-full">
                        <div className="h-4 bg-indigo-600 rounded-full" style={{ width: '52%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>52% Complete</span>
                        <span>13/25 Measures</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Social and Emotional Development</h4>
                      <div className="h-4 w-full bg-gray-200 rounded-full">
                        <div className="h-4 bg-gray-400 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>Not Started</span>
                        <span>0/15 Measures</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Approaches to Learning–Self-Regulation</h4>
                      <div className="h-4 w-full bg-gray-200 rounded-full">
                        <div className="h-4 bg-gray-400 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>Not Started</span>
                        <span>0/12 Measures</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Learning Groups Tab */}
        {activeTab === 'groups' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Learning Groups</h2>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                Create Group
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {/* Literacy Group */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-blue-50 px-4 py-4 border-b border-blue-100">
                  <h3 className="font-medium text-gray-900">Early Literacy Group</h3>
                  <p className="text-sm text-gray-500">Letter recognition and phonological awareness</p>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Students:</h4>
                  <ul className="space-y-1">
                    <li className="flex items-center text-sm">
                      <span className="text-blue-500 mr-2">•</span>
                      Sam Wilson
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="text-blue-500 mr-2">•</span>
                      Casey Green
                    </li>
                  </ul>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Focus:</h4>
                    <p className="text-sm text-gray-600">Letter identification A-M, initial sound isolation</p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                      Edit Group
                    </button>
                  </div>
                </div>
              </div>

              {/* Math Group */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-green-50 px-4 py-4 border-b border-green-100">
                  <h3 className="font-medium text-gray-900">Number Concepts Group</h3>
                  <p className="text-sm text-gray-500">Counting and early addition concepts</p>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Students:</h4>
                  <ul className="space-y-1">
                    <li className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">•</span>
                      Riley Thomas
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">•</span>
                      Casey Green
                    </li>
                  </ul>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Focus:</h4>
                    <p className="text-sm text-gray-600">Counting to 20, one-to-one correspondence</p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button className="text-green-600 text-sm font-medium hover:text-green-800">
                      Edit Group
                    </button>
                  </div>
                </div>
              </div>

              {/* Empty state card */}
              <div className="border border-dashed rounded-lg p-6 text-center bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Create a new learning group</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Organize students by skill level or learning targets
                </p>
                <button className="mt-4 bg-white text-indigo-600 border border-indigo-600 px-3 py-1 rounded-md text-xs font-medium hover:bg-indigo-50">
                  Create Group
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Existing Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Student to Classroom</h3>

            {unassignedStudents.length === 0 ? (
              <p className="text-gray-500">No unassigned students available.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {unassignedStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => handleAddExistingStudent(student)}
                    className="border text-left rounded-md p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-500">Grade: {student.grade}</p>
                      </div>
                      <span className="text-indigo-600 text-sm font-medium">Add</span>
                    </div>
                    {student.notes && (
                      <p className="text-sm text-gray-500 mt-2">{student.notes}</p>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Student Modal */}
      {showCreateStudentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Student
            </h3>

            <form onSubmit={handleCreateStudent}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={newStudent.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                    Grade
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    value={newStudent.grade}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="TK">Transitional Kindergarten</option>
                    <option value="K">Kindergarten</option>
                    <option value="1">First Grade</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    value={newStudent.notes}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Optional notes about this student"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateStudentModal(false)}
                    className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700"
                  >
                    Create Student
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherClassroom; 