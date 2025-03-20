import React, { useState, useEffect } from 'react';
import DrdpAssessment from './DrdpAssessment';

// Sample student data
const sampleStudents = [
  { id: 1, name: 'Emily Johnson', grade: 'TK', age: 4.5, photoUrl: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Miguel Rodriguez', grade: 'TK', age: 4.7, photoUrl: 'https://via.placeholder.com/40' },
  { id: 3, name: 'Sarah Williams', grade: 'K', age: 5.2, photoUrl: 'https://via.placeholder.com/40' },
  { id: 4, name: 'James Smith', grade: 'K', age: 5.1, photoUrl: 'https://via.placeholder.com/40' },
  { id: 5, name: 'Aiden Brown', grade: 'TK', age: 4.8, photoUrl: 'https://via.placeholder.com/40' },
  { id: 6, name: 'Zoe Garcia', grade: 'K', age: 5.3, photoUrl: 'https://via.placeholder.com/40' },
  { id: 7, name: 'Jordan Lee', grade: 'TK', age: 4.9, photoUrl: 'https://via.placeholder.com/40' },
  { id: 8, name: 'Olivia Martinez', grade: 'K', age: 5.5, photoUrl: 'https://via.placeholder.com/40' }
];

// Sample assessment data
const sampleAssessments = [
  {
    id: 1,
    studentId: 1,
    type: 'preschool',
    date: '2023-09-15',
    completedBy: 'Ms. Thompson',
    progress: 100,
    domains: {
      'ATL-REG': 7.5,
      'SED': 6.8,
      'LLD': 8.2,
      'COG': 7.0
    }
  },
  {
    id: 2,
    studentId: 1,
    type: 'preschool',
    date: '2023-11-20',
    completedBy: 'Ms. Thompson',
    progress: 100,
    domains: {
      'ATL-REG': 8.0,
      'SED': 7.2,
      'LLD': 8.5,
      'COG': 7.8
    }
  },
  {
    id: 3,
    studentId: 3,
    type: 'kindergarten',
    date: '2023-10-05',
    completedBy: 'Mr. Peterson',
    progress: 85,
    domains: {
      'ATL-REG': 6.5,
      'SED': 7.0,
      'LLD': 7.8,
      'COG-MATH': 8.0,
      'COG-SCI': 7.2
    }
  }
];

const DrdpDashboard = () => {
  // State variables
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assessmentType, setAssessmentType] = useState('preschool');
  const [students, setStudents] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  // Sample domains for filtering
  const domains = [
    { id: 'all', name: 'All Domains' },
    { id: 'ATL-REG', name: 'Approaches to Learning' },
    { id: 'SED', name: 'Social and Emotional Development' },
    { id: 'LLD', name: 'Language and Literacy Development' },
    { id: 'COG', name: 'Cognition Including Math' },
    { id: 'PD-HLTH', name: 'Physical Development-Health' },
    { id: 'HSS', name: 'History-Social Science' },
    { id: 'VPA', name: 'Visual and Performing Arts' }
  ];

  // Load sample data on component mount
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setStudents(sampleStudents);
      setAssessments(sampleAssessments);
      setLoading(false);
    }, 1000);
  }, []); // No dependencies since sample data is now outside the component

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toString().includes(searchTerm)
  );

  // Handle starting a new assessment
  const handleStartAssessment = (student) => {
    setSelectedStudent(student);
    setActiveView('assessment');
  };

  // Handle viewing assessment history
  const handleViewHistory = (student) => {
    setSelectedStudent(student);
    setActiveView('history');
  };

  // Handle returning to dashboard
  const handleReturnToDashboard = () => {
    setSelectedStudent(null);
    setActiveView('dashboard');
  };

  // Filter assessments for the selected student
  const studentAssessments = selectedStudent
    ? assessments.filter(assessment => assessment.studentId === selectedStudent.id)
    : [];

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Render assessment view
  if (activeView === 'assessment' && selectedStudent) {
    return (
      <div>
        <button
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
          onClick={handleReturnToDashboard}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </button>
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">Student: {selectedStudent.name}</h2>
          <p className="text-gray-600">Grade: {selectedStudent.grade} | Age: {selectedStudent.age}</p>
        </div>
        <DrdpAssessment
          studentId={selectedStudent.id}
          assessmentType={assessmentType}
        />
      </div>
    );
  }

  // Render assessment history view
  if (activeView === 'history' && selectedStudent) {
    return (
      <div>
        <button
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
          onClick={handleReturnToDashboard}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </button>
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">Assessment History: {selectedStudent.name}</h2>
          <p className="text-gray-600">Grade: {selectedStudent.grade} | Age: {selectedStudent.age}</p>
        </div>

        {studentAssessments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-lg text-gray-600">No assessments available for this student.</p>
            <button
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={() => handleStartAssessment(selectedStudent)}
            >
              Start New Assessment
            </button>
          </div>
        ) : (
          <div>
            {/* Assessment Progress Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Development Progress</h3>
              <div className="h-64 w-full">
                {/* Here would go a chart component displaying progress over time */}
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">Progress chart would render here</p>
                </div>
              </div>
            </div>

            {/* Assessment List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentAssessments.map(assessment => (
                    <tr key={assessment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(assessment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {assessment.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assessment.completedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-indigo-600 h-2.5 rounded-full"
                            style={{ width: `${assessment.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{assessment.progress}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                          View
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Export
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render dashboard view (default)
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">DRDP Assessment Dashboard</h1>

      {/* Control panel */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="w-full md:w-1/3">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Students</label>
            <input
              type="text"
              id="search"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-1/3">
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">Filter by Domain</label>
            <select
              id="domain"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              {domains.map(domain => (
                <option key={domain.id} value={domain.id}>{domain.name}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label htmlFor="assessment-type" className="block text-sm font-medium text-gray-700 mb-1">Assessment Type</label>
            <select
              id="assessment-type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={assessmentType}
              onChange={(e) => setAssessmentType(e.target.value)}
            >
              <option value="preschool">Preschool/TK</option>
              <option value="kindergarten">Kindergarten</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student list */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Students</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Select a student to start a new assessment or view history.</p>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500">No students found matching your search criteria.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredStudents.map(student => (
              <li key={student.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full mr-3" src={student.photoUrl} alt={student.name} />
                    <div>
                      <p className="text-sm font-medium text-indigo-600">{student.name}</p>
                      <p className="text-sm text-gray-500">Grade: {student.grade} | Age: {student.age}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 text-sm"
                      onClick={() => handleViewHistory(student)}
                    >
                      View History
                    </button>
                    <button
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                      onClick={() => handleStartAssessment(student)}
                    >
                      New Assessment
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-2">Total Assessments</h3>
          <p className="text-3xl font-bold text-indigo-600">{assessments.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
          <p className="text-gray-600">Last assessment: {assessments.length > 0 ? new Date(assessments[assessments.length - 1].date).toLocaleDateString() : 'None'}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-2">Completion Rate</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${assessments.filter(a => a.progress === 100).length / Math.max(assessments.length, 1) * 100}%` }}
            ></div>
          </div>
          <p className="text-gray-600">{assessments.filter(a => a.progress === 100).length} of {assessments.length} complete</p>
        </div>
      </div>
    </div>
  );
};

export default DrdpDashboard; 