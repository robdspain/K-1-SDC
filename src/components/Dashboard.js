import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DrdpAssessment from './DrdpAssessment';
import FeatureChecklist from './FeatureChecklist';

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
  const [showFeatureChecklist, setShowFeatureChecklist] = useState(false);
  const [assessmentView, setAssessmentView] = useState('preschool');

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

  // Demo data for development levels
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

    setStudents(demoStudents);
    setAssessments(demoAssessments);
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

  const handleSaveAssessment = (assessment) => {
    setAssessments([...assessments, assessment]);
    setIsAssessing(false);
    // Automatically navigate to results tab
    setActiveTab('results');
  };

  const handleCancelAssessment = () => {
    setIsAssessing(false);
  };

  const getStudentAssessments = (studentId) => {
    return assessments.filter(assessment => assessment.studentId === studentId);
  };

  const toggleFeatureChecklist = () => {
    setShowFeatureChecklist(!showFeatureChecklist);
  };

  // Function to determine if domain is implemented for assessment
  const isDomainImplemented = (domainId) => {
    // For MVP, only LLD and COG domains are implemented
    return ['LLD', 'COG'].includes(domainId);
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
                to="/classroom"
                className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-400"
              >
                My Classroom
              </Link>
              <Link
                to="/drdp-domains"
                className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-400"
              >
                DRDP Domains
              </Link>
              <button
                onClick={toggleFeatureChecklist}
                className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-400"
              >
                Feature Checklist
              </button>
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

      {/* Dashboard Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        </div>
      </header>

      {/* Feature Checklist Modal */}
      {showFeatureChecklist && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full max-h-screen overflow-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={toggleFeatureChecklist}
                className="bg-white rounded-full p-2 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FeatureChecklist />
          </div>
        </div>
      )}

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
              Student Profiles
            </button>
            <button
              onClick={() => setActiveTab('assessments')}
              className={`${activeTab === 'assessments'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Assessments
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`${activeTab === 'results'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Results
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Student Profiles Tab */}
        {activeTab === 'students' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Student List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Students</h2>

              {students.length === 0 ? (
                <p className="text-gray-500">No students added yet.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <li key={student.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">{student.name}</h3>
                          <p className="text-sm text-gray-500">Grade: {student.grade}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSelectStudent(student)}
                            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-sm"
                          >
                            Assess
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setActiveTab('results');
                            }}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm"
                          >
                            View Results
                          </button>
                        </div>
                      </div>
                      {student.notes && (
                        <p className="mt-1 text-sm text-gray-500">{student.notes}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add Student Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Student</h2>

              <form onSubmit={handleStudentSubmit}>
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
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Student
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && !isAssessing && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Assessments</h2>

            {!selectedStudent ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Please select a student to perform an assessment.</p>
                <button
                  onClick={() => setActiveTab('students')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Select Student
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="font-medium">Selected Student: {selectedStudent.name}</h3>
                  <p className="text-sm text-gray-500">Grade: {selectedStudent.grade}</p>
                </div>

                {/* Assessment view selector */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Select Assessment Type</h3>
                  <div className="flex space-x-4 mb-4">
                    <button
                      onClick={() => setAssessmentView('preschool')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${assessmentView === 'preschool'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      TK/Preschool DRDP
                    </button>
                    <button
                      onClick={() => setAssessmentView('kindergarten')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${assessmentView === 'kindergarten'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      Kindergarten DRDP
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    {assessmentView === 'preschool'
                      ? 'TK/Preschool view focuses on 8 developmental domains with foundational early learning skills.'
                      : 'Kindergarten view includes 11 domains aligned with academic readiness and school expectations.'}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">DRDP Domains</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Language and Literacy Domain Card */}
                    <div className="border rounded-md p-4 bg-indigo-50 border-indigo-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">LLD: Language and Literacy Development</h4>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Implemented
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Assessment of receptive/expressive language, literacy interest, and early writing skills.
                      </p>
                      <button
                        onClick={handleCreateAssessment}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                      >
                        Start LLD Assessment
                      </button>
                    </div>

                    {/* Cognition Domain Card */}
                    <div className="border rounded-md p-4 bg-indigo-50 border-indigo-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">COG: Cognition, Including Math and Science</h4>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Implemented
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Assessment of mathematical thinking, problem-solving, and scientific reasoning.
                      </p>
                      <button
                        onClick={handleCreateAssessment}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                      >
                        Start COG Assessment
                      </button>
                    </div>

                    {/* Social-Emotional Domain Card - Coming Soon */}
                    <div className="border rounded-md p-4 bg-gray-50 border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">SED: Social and Emotional Development</h4>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Assessment of identity development, emotional understanding, and peer relationships.
                      </p>
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
                      >
                        Available in Next Update
                      </button>
                    </div>

                    {/* ATL-REG Domain Card - Coming Soon */}
                    <div className="border rounded-md p-4 bg-gray-50 border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">ATL-REG: Approaches to Learning–Self-Regulation</h4>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Assessment of attention maintenance, persistence, curiosity, and self-control.
                      </p>
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
                      >
                        Available in Next Update
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/drdp-domains"
                      className="text-indigo-600 text-sm font-medium hover:text-indigo-500"
                    >
                      View all DRDP domains and measures →
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">DRDP Measures Sample</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Measure ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Measure Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Domain
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {drdpMeasures.slice(0, 5).map((measure) => (
                          <tr key={measure.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {measure.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {measure.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {measure.domain}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Showing 5 of {drdpMeasures.length} DRDP measures.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Assessment View */}
        {activeTab === 'assessments' && isAssessing && selectedStudent && (
          <DrdpAssessment
            student={selectedStudent}
            onSaveAssessment={handleSaveAssessment}
            onCancel={handleCancelAssessment}
          />
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Assessment Results</h2>

            {!selectedStudent ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Please select a student to view their assessment results.</p>
                <button
                  onClick={() => setActiveTab('students')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Select Student
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="font-medium">Results for: {selectedStudent.name}</h3>
                  <p className="text-sm text-gray-500">Grade: {selectedStudent.grade}</p>
                </div>

                {getStudentAssessments(selectedStudent.id).length === 0 ? (
                  <p className="text-gray-500">No assessments found for this student.</p>
                ) : (
                  <div className="space-y-8">
                    {getStudentAssessments(selectedStudent.id).map((assessment) => (
                      <div key={assessment.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b">
                          <div className="flex justify-between items-center">
                            <h3 className="text-md font-medium">{assessment.type} Assessment</h3>
                            <span className="text-sm text-gray-500">Date: {assessment.date}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-medium mb-2">Assessed Measures:</h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Measure</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Developmental Level</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {assessment.measures.map((measure, index) => {
                                  const measureInfo = drdpMeasures.find(m => m.id === measure.measureId);
                                  const levelInfo = developmentLevels.find(l => l.value === measure.level);

                                  return (
                                    <tr key={index}>
                                      <td className="px-4 py-2 text-sm">
                                        <div className="font-medium">{measureInfo?.id || measure.measureId}</div>
                                        <div className="text-xs text-gray-500">{measureInfo?.name || ''}</div>
                                      </td>
                                      <td className="px-4 py-2 text-sm">
                                        {levelInfo?.label || measure.level}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-500">
                                        {measure.notes}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 border-t">
                          <div className="flex justify-end">
                            <button className="text-sm text-indigo-600 hover:text-indigo-900">
                              Generate Learning Targets
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard; 