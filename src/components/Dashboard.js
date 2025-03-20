import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DrdpAssessment from './DrdpAssessment';
import DrdpDataVisualization from './DrdpDataVisualization';
import { Nav, Button } from 'react-bootstrap';

// Mock database service - in a real app, this would connect to your actual database
const dbService = {
  saveAssessment: async (assessment) => {
    // This would be an API call in a real app
    console.log('Saving assessment to database:', assessment);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return success response
    return {
      success: true,
      data: {
        ...assessment,
        id: assessment.id || Date.now().toString(),
        savedAt: new Date().toISOString()
      }
    };
  },

  getAssessments: async (studentId = null) => {
    // This would be an API call in a real app
    console.log('Fetching assessments from database', studentId ? `for student ${studentId}` : '');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For demo, we're using local storage to persist the data between refreshes
    const storedAssessments = localStorage.getItem('assessments');
    const assessments = storedAssessments ? JSON.parse(storedAssessments) : [];

    return {
      success: true,
      data: studentId
        ? assessments.filter(a => a.studentId === studentId)
        : assessments
    };
  }
};

function Dashboard() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    id: '',
    name: '',
    grade: 'K',
    notes: ''
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentView, setAssessmentView] = useState('preschool');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Demo data for DRDP measures
  const drdpMeasures = [
    { id: 'LLD1', name: 'Understanding of Language (Receptive)', domain: 'Language and Literacy Development' },
    { id: 'LLD2', name: 'Responsiveness to Language', domain: 'Language and Literacy Development' },
    { id: 'LLD3', name: 'Communication and Use of Language (Expressive)', domain: 'Language and Literacy Development' },
    { id: 'LLD4', name: 'Reciprocal Communication and Conversation', domain: 'Language and Literacy Development' },
    { id: 'LLD5', name: 'Interest in Literacy', domain: 'Language and Literacy Development' },
    { id: 'LLD6', name: 'Comprehension of Age-Appropriate Text', domain: 'Language and Literacy Development' },
    { id: 'LLD7', name: 'Concepts About Print', domain: 'Language and Literacy Development' },
    { id: 'LLD8', name: 'Phonological Awareness', domain: 'Language and Literacy Development' },
    { id: 'LLD9', name: 'Letter and Word Knowledge', domain: 'Language and Literacy Development' },
    { id: 'LLD10', name: 'Emergent Writing', domain: 'Language and Literacy Development' },
    { id: 'COG1', name: 'Spatial Relationships', domain: 'Cognition, Including Math and Science' },
    { id: 'COG2', name: 'Classification', domain: 'Cognition, Including Math and Science' },
    { id: 'COG3', name: 'Number Sense of Quantity', domain: 'Cognition, Including Math and Science' },
    { id: 'COG4', name: 'Number Sense of Math Operations', domain: 'Cognition, Including Math and Science' },
    { id: 'COG5', name: 'Measurement', domain: 'Cognition, Including Math and Science' }
  ];

  // Developmental levels
  const developmentLevels = [
    { value: 'exploring-earlier', label: 'Exploring Earlier' },
    { value: 'exploring-middle', label: 'Exploring Middle' },
    { value: 'exploring-later', label: 'Exploring Later' },
    { value: 'building-earlier', label: 'Building Earlier' },
    { value: 'building-middle', label: 'Building Middle' },
    { value: 'building-later', label: 'Building Later' },
    { value: 'integrating-earlier', label: 'Integrating Earlier' },
    { value: 'integrating-middle', label: 'Integrating Middle' },
    { value: 'integrating-later', label: 'Integrating Later' }
  ];

  // Load demo data
  useEffect(() => {
    // In a real app, this would be an API call
    const demoStudents = [
      { id: '1', name: 'Alex Johnson', grade: 'K', notes: 'Struggles with letter recognition' },
      { id: '2', name: 'Sam Martinez', grade: '1', notes: 'Strong in math concepts' },
      { id: '3', name: 'Taylor Wilson', grade: 'K', notes: 'Needs support with phonological awareness' }
    ];

    // Load students
    setStudents(demoStudents);

    // Load assessments from our database service
    const loadAssessments = async () => {
      setIsLoading(true);
      try {
        const response = await dbService.getAssessments();

        if (response.success) {
          setAssessments(response.data);
        } else {
          throw new Error("Failed to load assessments");
        }
      } catch (err) {
        console.error("Error loading assessments:", err);
        setError("Failed to load assessment data");

        // Fallback to demo data if database fails
        const demoAssessments = [
          {
            id: '1',
            studentId: '1',
            date: '2024-03-15',
            type: 'DRDP',
            measures: [
              { measureId: 'LLD9', level: 'exploring-later', notes: 'Recognizes some letters of alphabet' },
              { measureId: 'LLD8', level: 'exploring-middle', notes: 'Beginning to identify some sounds' },
              { measureId: 'COG3', level: 'building-earlier', notes: 'Can count to 10 reliably' }
            ]
          },
          {
            id: '2',
            studentId: '2',
            date: '2024-03-17',
            type: 'DRDP',
            measures: [
              { measureId: 'COG3', level: 'building-later', notes: 'Demonstrates strong counting skills' },
              { measureId: 'COG4', level: 'building-middle', notes: 'Beginning to understand addition concepts' },
              { measureId: 'LLD9', level: 'building-earlier', notes: 'Recognizes most letters' }
            ]
          }
        ];

        setAssessments(demoAssessments);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessments();
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    const studentId = String(students.length + 1);
    const student = { ...newStudent, id: studentId };
    setStudents([...students, student]);
    setNewStudent({ id: '', name: '', grade: 'K', notes: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setActiveTab('assessments');
  };

  const handleCreateAssessment = () => {
    if (!selectedStudent) return;
    setIsAssessing(true);
  };

  const handleSaveAssessment = async (assessment) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await dbService.saveAssessment(assessment);

      if (response.success) {
        const updatedAssessment = response.data;

        // Update local state
        setAssessments([...assessments, updatedAssessment]);

        // Store in localStorage for persistence in this demo
        const allAssessments = [...assessments, updatedAssessment];
        localStorage.setItem('assessments', JSON.stringify(allAssessments));

        // Automatically navigate to results tab
        setIsAssessing(false);
        setActiveTab('results');
      } else {
        throw new Error("Failed to save assessment");
      }
    } catch (err) {
      console.error("Error saving assessment:", err);
      setError("Failed to save assessment data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAssessment = () => {
    setIsAssessing(false);
  };

  const getStudentAssessments = (studentId) => {
    return assessments.filter(assessment => assessment.studentId === studentId);
  };

  // Function to determine if domain is implemented for assessment
  const isDomainImplemented = (domainId) => {
    // For MVP, only LLD and COG domains are implemented
    return ['LLD', 'COG'].includes(domainId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-white text-lg font-medium">DRDP Teacher Portal</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Nav className="ml-auto">
                  <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link href="/drdp-domains">DRDP Domains</Nav.Link>
                  <Nav.Link href="/essential-skills">Essential Skills</Nav.Link>
                  {userRole === 'admin' && <Nav.Link href="/admin">Admin</Nav.Link>}
                  {userRole === 'teacher' && <Nav.Link href="/classroom">Classroom</Nav.Link>}
                  <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                </Nav>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                type="button"
                className="bg-indigo-600 p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
              >
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-indigo-600 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                  >
                    <span className="sr-only">Open user menu</span>
                    <svg className="h-8 w-8 rounded-full bg-indigo-700 p-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-indigo-600 mb-4" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-gray-500">Loading dashboard data...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Student Selection Panel */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Students</h3>
                        <div className="flex flex-col space-y-2">
                          {students.map(student => (
                            <button
                              key={student.id}
                              onClick={() => setSelectedStudent(student)}
                              className={`flex items-center px-3 py-2 text-sm rounded-md ${selectedStudent && selectedStudent.id === student.id
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {student.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <button
                          onClick={() => handleCreateAssessment()}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Create New Assessment
                        </button>
                      </div>
                    </div>

                    {/* Summary Panel */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Assessment Summary</h3>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Total Students</dt>
                            <dd className="mt-1 text-3xl font-semibold text-indigo-600">{students.length}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Total Assessments</dt>
                            <dd className="mt-1 text-3xl font-semibold text-indigo-600">{assessments.length}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Recent Assessments</dt>
                            <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                              {assessments.filter(a => {
                                const assessmentDate = new Date(a.date);
                                const lastMonth = new Date();
                                lastMonth.setMonth(lastMonth.getMonth() - 1);
                                return assessmentDate >= lastMonth;
                              }).length}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Completion Rate</dt>
                            <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                              {students.length > 0
                                ? `${Math.round((assessments.length / students.length) * 100)}%`
                                : '0%'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all assessments</a>
                      </div>
                    </div>

                    {/* Upcoming Tasks Panel */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Upcoming Tasks</h3>
                        <ul className="divide-y divide-gray-200">
                          <li className="py-3">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Complete mid-year assessments</p>
                                <p className="text-sm text-gray-500">Due by Dec 15</p>
                              </div>
                            </div>
                          </li>
                          <li className="py-3">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Parent-teacher conferences</p>
                                <p className="text-sm text-gray-500">Schedule by Nov 30</p>
                              </div>
                            </div>
                          </li>
                          <li className="py-3">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Update student progress reports</p>
                                <p className="text-sm text-gray-500">Due by Dec 1</p>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all tasks</a>
                      </div>
                    </div>
                  </div>

                  {/* Data Visualization Section */}
                  <div className="mt-8">
                    <DrdpDataVisualization
                      assessments={assessments}
                      students={students}
                      measures={drdpMeasures}
                      selectedStudent={selectedStudent}
                    />
                  </div>

                  {/* Recent Assessments Table */}
                  <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Assessments</h3>
                    </div>
                    <div className="flex flex-col">
                      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                          <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Measures
                                  </th>
                                  <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {assessments.slice(0, 5).map(assessment => {
                                  const student = students.find(s => s.id === assessment.studentId);
                                  return (
                                    <tr key={assessment.id}>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-700 font-medium">{student?.name.substring(0, 2)}</span>
                                          </div>
                                          <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{student?.name}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{assessment.date}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                          {assessment.type}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {assessment.measures?.length || 0} measures
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">View</a>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create Assessment Modal */}
      {isAssessing && selectedStudent && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleCancelAssessment}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    New Assessment for {selectedStudent.name}
                  </h3>
                  <div className="mt-2">
                    <DrdpAssessment
                      student={selectedStudent}
                      onSaveAssessment={handleSaveAssessment}
                      onCancel={handleCancelAssessment}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard; 