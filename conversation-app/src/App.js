import React, { useState } from 'react';
import './App.css';
import DrdpDashboard from './components/DrdpDashboard';
import DrdpAssessment from './components/DrdpAssessment';
import DrdpDataVisualization from './components/DrdpDataVisualization';
import DrdpReportGenerator from './components/DrdpReportGenerator';
import UserProfile from './components/UserProfile';
import SettingsPanel from './components/SettingsPanel';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  // Sample domains data
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

  // Sample user data
  const userData = {
    id: 1,
    name: 'Jennifer Thompson',
    email: 'jthompson@schooldistrict.edu',
    role: 'Teacher',
    school: 'Lincoln Elementary School',
    photoUrl: 'https://via.placeholder.com/150',
    jobTitle: 'Special Day Class Teacher',
    credentials: 'M.Ed., Special Education',
    preferredLanguage: 'English',
    notificationPreferences: {
      email: true,
      inApp: true,
      assessmentReminders: true
    }
  };

  // Sample settings data
  const settingsData = {
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      colorBlindMode: false,
      highContrastMode: false
    },
    assessments: {
      autoSaveInterval: 5,
      defaultAssessmentType: 'preschool',
      showCompletionProgress: true,
      showDomainDescriptions: true
    }
  };

  // Handle login submission
  const handleLogin = (e) => {
    e.preventDefault();

    // In a real app, this would validate against a backend
    if (userName && password) {
      setIsLoggedIn(true);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setPassword('');
  };

  // Handle saving user profile
  const handleSaveProfile = (updatedProfile) => {
    console.log('Saving updated profile:', updatedProfile);
    // In a real app, this would call an API endpoint
  };

  // Handle saving settings
  const handleSaveSettings = (updatedSettings) => {
    console.log('Saving updated settings:', updatedSettings);
    // In a real app, this would call an API endpoint
  };

  // Render login view
  const renderLogin = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              K-1 SDC Assessment
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access the DRDP assessment tools
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Demo credentials: "teacher" / "password"
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render main application
  const renderApp = () => {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-indigo-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="text-xl font-bold">K-1 SDC Assessment</div>
              </div>
              <div className="flex items-center">
                <button
                  className={`px-3 py-2 mx-1 text-sm rounded-md ${currentView === 'dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
                  onClick={() => setCurrentView('dashboard')}
                >
                  Dashboard
                </button>
                <button
                  className={`px-3 py-2 mx-1 text-sm rounded-md ${currentView === 'assessment' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
                  onClick={() => setCurrentView('assessment')}
                >
                  Assessment
                </button>
                <button
                  className={`px-3 py-2 mx-1 text-sm rounded-md ${currentView === 'reports' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
                  onClick={() => setCurrentView('reports')}
                >
                  Reports
                </button>
                <button
                  className={`px-3 py-2 mx-1 text-sm rounded-md ${currentView === 'profile' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
                  onClick={() => setCurrentView('profile')}
                >
                  Profile
                </button>
                <button
                  className={`px-3 py-2 mx-1 text-sm rounded-md ${currentView === 'settings' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
                  onClick={() => setCurrentView('settings')}
                >
                  Settings
                </button>
                <button
                  className="ml-4 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 rounded-md"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {currentView === 'dashboard' && <DrdpDashboard />}

          {currentView === 'assessment' && (
            <div className="px-4 py-6 sm:px-0">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">DRDP Assessment</h1>
              <DrdpAssessment studentId={1} assessmentType="preschool" />
            </div>
          )}

          {currentView === 'reports' && (
            <div className="px-4 py-6 sm:px-0">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Assessment Reports</h1>

              <div className="grid grid-cols-1 gap-6">
                {/* Sample student data */}
                <DrdpReportGenerator
                  student={{
                    id: 1,
                    name: 'Emily Johnson',
                    grade: 'TK',
                    age: 4.5,
                    photoUrl: 'https://via.placeholder.com/40'
                  }}
                  assessments={[
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
                    }
                  ]}
                  domains={domains}
                />

                <DrdpDataVisualization
                  assessments={[
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
                    }
                  ]}
                  domains={domains}
                />
              </div>
            </div>
          )}

          {currentView === 'profile' && (
            <div className="px-4 py-6 sm:px-0">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">User Profile</h1>
              <UserProfile user={userData} onSave={handleSaveProfile} />
            </div>
          )}

          {currentView === 'settings' && (
            <div className="px-4 py-6 sm:px-0">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Application Settings</h1>
              <SettingsPanel initialSettings={settingsData} onSave={handleSaveSettings} />
            </div>
          )}
        </main>
      </div>
    );
  };

  return isLoggedIn ? renderApp() : renderLogin();
}

export default App; 