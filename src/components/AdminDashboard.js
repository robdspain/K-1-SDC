import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdmin = localStorage.getItem('userRole') === 'admin';
  const [activeTab, setActiveTab] = useState('teachers');

  // Sample data - in a real app, this would come from an API
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  // Form states
  const [newTeacher, setNewTeacher] = useState({
    id: '',
    name: '',
    email: '',
    role: 'teacher'
  });

  const [newClassroom, setNewClassroom] = useState({
    id: '',
    name: '',
    grade: 'K',
    teacherId: ''
  });

  // Modals
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  // Load demo data
  useEffect(() => {
    // In a real app, these would be API calls
    const demoTeachers = [
      { id: '1', name: 'Jamie Smith', email: 'jsmith@school.edu', role: 'teacher' },
      { id: '2', name: 'Alex Johnson', email: 'ajohnson@school.edu', role: 'teacher' },
      { id: '3', name: 'Taylor Lopez', email: 'tlopez@school.edu', role: 'teacher' }
    ];

    const demoStudents = [
      { id: '1', name: 'Sam Wilson', grade: 'K', notes: 'Needs support with letter recognition' },
      { id: '2', name: 'Jordan Davis', grade: '1', notes: 'Strong in math concepts' },
      { id: '3', name: 'Casey Green', grade: 'K', notes: 'Working on phonological awareness' },
      { id: '4', name: 'Riley Thomas', grade: 'K', notes: 'Receptive language delays' },
      { id: '5', name: 'Morgan Lee', grade: '1', notes: 'Progressing well with number concepts' }
    ];

    const demoClassrooms = [
      {
        id: '1',
        name: 'Room 101 - TK/K',
        grade: 'K',
        teacherId: '1',
        studentIds: ['1', '3', '4']
      },
      {
        id: '2',
        name: 'Room 102 - K/1',
        grade: 'K-1',
        teacherId: '2',
        studentIds: ['2', '5']
      }
    ];

    setTeachers(demoTeachers);
    setStudents(demoStudents);
    setClassrooms(demoClassrooms);
  }, []);

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleTeacherSubmit = (e) => {
    e.preventDefault();
    const teacherId = String(teachers.length + 1);
    const teacher = { ...newTeacher, id: teacherId };
    setTeachers([...teachers, teacher]);
    setNewTeacher({ id: '', name: '', email: '', role: 'teacher' });
    setShowTeacherModal(false);
  };

  const handleClassroomSubmit = (e) => {
    e.preventDefault();
    const classroomId = String(classrooms.length + 1);
    const classroom = { ...newClassroom, id: classroomId, studentIds: [] };
    setClassrooms([...classrooms, classroom]);
    setNewClassroom({ id: '', name: '', grade: 'K', teacherId: '' });
    setShowClassroomModal(false);
  };

  const handleInputChange = (e, setterFunction, currentState) => {
    const { name, value } = e.target;
    setterFunction({ ...currentState, [name]: value });
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unassigned';
  };

  const getClassroomStudentCount = (classroomId) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    return classroom ? classroom.studentIds.length : 0;
  };

  const getStudentsInClassroom = (classroomId) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    if (!classroom) return [];

    return classroom.studentIds.map(id => {
      return students.find(s => s.id === id);
    }).filter(s => s); // Filter out any undefined values
  };

  const getUnassignedStudents = () => {
    const assignedIds = classrooms.flatMap(c => c.studentIds);
    return students.filter(s => !assignedIds.includes(s.id));
  };

  const handleAssignStudent = (classroomId, studentId) => {
    setClassrooms(classrooms.map(classroom => {
      if (classroom.id === classroomId) {
        return {
          ...classroom,
          studentIds: [...classroom.studentIds, studentId]
        };
      }
      return classroom;
    }));
  };

  const handleRemoveStudent = (classroomId, studentId) => {
    setClassrooms(classrooms.map(classroom => {
      if (classroom.id === classroomId) {
        return {
          ...classroom,
          studentIds: classroom.studentIds.filter(id => id !== studentId)
        };
      }
      return classroom;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-indigo-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white font-bold text-xl">K-1 SDC Assessment Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/drdp-domains"
                className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-500"
              >
                DRDP Domains
              </Link>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-indigo-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100"
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('teachers')}
              className={`${activeTab === 'teachers'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Teachers
            </button>
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
              onClick={() => setActiveTab('classrooms')}
              className={`${activeTab === 'classrooms'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Classrooms
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Teachers</h2>
              <button
                onClick={() => setShowTeacherModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Add Teacher
              </button>
            </div>

            {teachers.length === 0 ? (
              <p className="text-gray-500">No teachers added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classroom</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teachers.map((teacher) => {
                      const teacherClassroom = classrooms.find(c => c.teacherId === teacher.id);

                      return (
                        <tr key={teacher.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {teacher.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {teacher.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {teacher.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {teacherClassroom
                              ? teacherClassroom.name
                              : <span className="text-yellow-600">No classroom assigned</span>
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedTeacher(teacher);
                                setActiveTab('classrooms');
                              }}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              View Classroom
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTeacher(teacher);
                                setShowTeacherModal(true);
                              }}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">All Students</h2>
            </div>

            {students.length === 0 ? (
              <p className="text-gray-500">No students added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classroom</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => {
                      const studentClassroom = classrooms.find(c => c.studentIds.includes(student.id));

                      return (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.grade}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {student.notes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {studentClassroom
                              ? studentClassroom.name
                              : <span className="text-red-600">Unassigned</span>
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setActiveTab('classrooms');
                                setSelectedClassroom(studentClassroom);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                              disabled={!studentClassroom}
                            >
                              View Classroom
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Classrooms Tab */}
        {activeTab === 'classrooms' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Classrooms</h2>
              <button
                onClick={() => setShowClassroomModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Create Classroom
              </button>
            </div>

            {classrooms.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">No classrooms created yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {classrooms.map((classroom) => (
                  <div key={classroom.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{classroom.name}</h3>
                          <p className="text-sm text-gray-500">Grade: {classroom.grade}</p>
                          <p className="text-sm text-gray-500">
                            Teacher: {getTeacherName(classroom.teacherId)}
                          </p>
                        </div>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                          {getClassroomStudentCount(classroom.id)} Students
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Students in this classroom:</h4>

                      {getStudentsInClassroom(classroom.id).length === 0 ? (
                        <p className="text-sm text-gray-500 mb-4">No students assigned to this classroom.</p>
                      ) : (
                        <ul className="divide-y divide-gray-200 mb-4">
                          {getStudentsInClassroom(classroom.id).map((student) => (
                            <li key={student.id} className="py-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-medium">{student.name}</p>
                                  <p className="text-xs text-gray-500">Grade: {student.grade}</p>
                                </div>
                                <button
                                  onClick={() => handleRemoveStudent(classroom.id, student.id)}
                                  className="text-red-600 hover:text-red-900 text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Add students to this classroom:</h4>
                        {getUnassignedStudents().length === 0 ? (
                          <p className="text-sm text-gray-500">No unassigned students available.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {getUnassignedStudents().map((student) => (
                              <button
                                key={student.id}
                                onClick={() => handleAssignStudent(classroom.id, student.id)}
                                className="border border-gray-300 text-left rounded-md px-3 py-2 text-sm hover:bg-gray-50"
                              >
                                <p className="font-medium">{student.name}</p>
                                <p className="text-xs text-gray-500">Grade: {student.grade}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Teacher Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h3>

            <form onSubmit={handleTeacherSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={selectedTeacher ? selectedTeacher.name : newTeacher.name}
                    onChange={(e) => handleInputChange(
                      e,
                      selectedTeacher ? setSelectedTeacher : setNewTeacher,
                      selectedTeacher ? selectedTeacher : newTeacher
                    )}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={selectedTeacher ? selectedTeacher.email : newTeacher.email}
                    onChange={(e) => handleInputChange(
                      e,
                      selectedTeacher ? setSelectedTeacher : setNewTeacher,
                      selectedTeacher ? selectedTeacher : newTeacher
                    )}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={selectedTeacher ? selectedTeacher.role : newTeacher.role}
                    onChange={(e) => handleInputChange(
                      e,
                      selectedTeacher ? setSelectedTeacher : setNewTeacher,
                      selectedTeacher ? selectedTeacher : newTeacher
                    )}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTeacherModal(false);
                      setSelectedTeacher(null);
                    }}
                    className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700"
                  >
                    {selectedTeacher ? 'Save Changes' : 'Add Teacher'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Classroom Modal */}
      {showClassroomModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedClassroom ? 'Edit Classroom' : 'Create New Classroom'}
            </h3>

            <form onSubmit={handleClassroomSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Classroom Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={selectedClassroom ? selectedClassroom.name : newClassroom.name}
                    onChange={(e) => handleInputChange(
                      e,
                      selectedClassroom ? setSelectedClassroom : setNewClassroom,
                      selectedClassroom ? selectedClassroom : newClassroom
                    )}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., Room 101 - K/1"
                  />
                </div>

                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                    Grade Level
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    value={selectedClassroom ? selectedClassroom.grade : newClassroom.grade}
                    onChange={(e) => handleInputChange(
                      e,
                      selectedClassroom ? setSelectedClassroom : setNewClassroom,
                      selectedClassroom ? selectedClassroom : newClassroom
                    )}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="TK">Transitional Kindergarten</option>
                    <option value="K">Kindergarten</option>
                    <option value="K-1">Kindergarten / First Grade</option>
                    <option value="1">First Grade</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">
                    Assign Teacher
                  </label>
                  <select
                    id="teacherId"
                    name="teacherId"
                    value={selectedClassroom ? selectedClassroom.teacherId : newClassroom.teacherId}
                    onChange={(e) => handleInputChange(
                      e,
                      selectedClassroom ? setSelectedClassroom : setNewClassroom,
                      selectedClassroom ? selectedClassroom : newClassroom
                    )}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowClassroomModal(false);
                      setSelectedClassroom(null);
                    }}
                    className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700"
                  >
                    {selectedClassroom ? 'Save Changes' : 'Create Classroom'}
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

export default AdminDashboard; 