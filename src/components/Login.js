import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  // Redirect to Auth0 login
  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  // For demo purposes, we also offer a mock login option
  const handleMockLogin = (role) => {
    // Store auth info in localStorage (for demo only)
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', role === 'admin' ? 'Admin User' : 'Teacher User');
    localStorage.setItem('userRole', role);

    // Redirect based on role
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to K-1 SDC Assessment
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access teacher dashboard, assessments, and student data
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <button
                onClick={handleLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in with Auth0
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or use demo login
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleMockLogin('teacher')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in as Teacher
              </button>

              <button
                onClick={() => handleMockLogin('admin')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in as Administrator
              </button>
            </div>

            <div className="mt-4 text-sm text-center">
              <p className="text-gray-600">
                For demo purposes, you can use the buttons above to access different roles.
              </p>
              <p className="text-gray-600 mt-2">
                To use Auth0 authentication, you need to configure your Auth0 credentials in the .env.local file.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 