import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, logoutUser } from '../utils/authUtils';

function Home() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const username = localStorage.getItem('user');
  const admin = isAdmin();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
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
            <div className="flex items-center">
              {authenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white">Welcome, {username}</span>

                  {admin ? (
                    <Link
                      to="/admin"
                      className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-400"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-400"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/classroom"
                        className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-400"
                      >
                        My Classroom
                      </Link>
                    </>
                  )}

                  <Link
                    to="/features"
                    className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-400"
                  >
                    Features
                  </Link>
                  <Link
                    to="/drdp-domains"
                    className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-400"
                  >
                    DRDP Domains
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-indigo-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/features"
                    className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-400"
                  >
                    Features
                  </Link>
                  <Link
                    to="/drdp-domains"
                    className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-400"
                  >
                    DRDP Domains
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white text-indigo-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Welcome to</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              K-1 SDC Assessment
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Empowering teachers to help students reach independence through targeted assessment and learning progressions
            </p>
            {!authenticated ? (
              <div className="mt-8">
                <Link
                  to="/login"
                  className="inline-block bg-indigo-600 px-5 py-3 rounded-md text-white font-medium hover:bg-indigo-700"
                >
                  Sign in to get started
                </Link>
              </div>
            ) : (
              <div className="mt-8">
                {admin ? (
                  <Link
                    to="/admin"
                    className="inline-block bg-indigo-600 px-5 py-3 rounded-md text-white font-medium hover:bg-indigo-700"
                  >
                    Go to Admin Dashboard
                  </Link>
                ) : (
                  <div className="flex justify-center space-x-4">
                    <Link
                      to="/dashboard"
                      className="inline-block bg-indigo-600 px-5 py-3 rounded-md text-white font-medium hover:bg-indigo-700"
                    >
                      Go to Teacher Dashboard
                    </Link>
                    <Link
                      to="/classroom"
                      className="inline-block bg-indigo-500 px-5 py-3 rounded-md text-white font-medium hover:bg-indigo-600"
                    >
                      Manage My Classroom
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Our application streamlines student assessment, making data-driven instruction easier and more effective.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="pt-6 border border-gray-200 rounded-lg bg-white shadow-md px-6 pb-8">
                <h3 className="text-lg font-medium text-gray-900">DRDP Integration</h3>
                <p className="mt-2 text-base text-gray-500">
                  Seamlessly integrate with the Desired Results Developmental Profile (DRDP) to establish baseline assessments and track student progress over time.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="pt-6 border border-gray-200 rounded-lg bg-white shadow-md px-6 pb-8">
                <h3 className="text-lg font-medium text-gray-900">Learning Ladders</h3>
                <p className="mt-2 text-base text-gray-500">
                  Access pre-defined learning progressions that break down skills into specific, achievable targets from foundational to advanced levels.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="pt-6 border border-gray-200 rounded-lg bg-white shadow-md px-6 pb-8">
                <h3 className="text-lg font-medium text-gray-900">IEP Goal Generation</h3>
                <p className="mt-2 text-base text-gray-500">
                  Generate appropriate IEP goals based on student's current position on the learning ladder, ensuring goals are both meaningful and attainable.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="pt-6 border border-gray-200 rounded-lg bg-white shadow-md px-6 pb-8">
                <h3 className="text-lg font-medium text-gray-900">Data-Driven Decision Making</h3>
                <p className="mt-2 text-base text-gray-500">
                  Collect opportunity-based data that helps you determine when students are ready to progress to the next learning target.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="pt-6 border border-gray-200 rounded-lg bg-white shadow-md px-6 pb-8">
                <h3 className="text-lg font-medium text-gray-900">Domain-Specific Targets</h3>
                <p className="mt-2 text-base text-gray-500">
                  Focus on key domains like Mathematics, ELA, and Writing with specific learning targets for each area of development.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="pt-6 border border-gray-200 rounded-lg bg-white shadow-md px-6 pb-8">
                <h3 className="text-lg font-medium text-gray-900">Progress Monitoring</h3>
                <p className="mt-2 text-base text-gray-500">
                  Visualize student progress against defined thresholds, making it easy to identify when to maintain or advance learning targets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Benefits for Teachers and Students
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Our assessment tools make learning more targeted and effective for everyone.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {/* Teacher Benefits */}
              <div className="pt-6 border border-gray-200 rounded-lg bg-gray-50 px-6 pb-8">
                <h3 className="text-xl font-bold text-center text-gray-900 mb-4">For Teachers</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Simplified data collection process that doesn't burden your day</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Clear visibility of current learning targets for each student</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Easy tracking of progress against specific, measurable targets</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Evidence-based decisions on when to advance to new targets</span>
                  </li>
                </ul>
              </div>

              {/* Student Benefits */}
              <div className="pt-6 border border-gray-200 rounded-lg bg-gray-50 px-6 pb-8">
                <h3 className="text-xl font-bold text-center text-gray-900 mb-4">For Students</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Learning goals tailored to their current development level</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Consistent progress through achievable learning steps</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Greater independence as skills are systematically developed</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Success experiences through properly sequenced learning</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Practical Examples Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Practical Applications
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              See how the K-1 SDC Assessment tool transforms daily instruction.
            </p>
          </div>

          <div className="mt-10 max-w-4xl mx-auto">
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Literacy Development Example
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <p className="text-base text-gray-500 mb-4">
                  When assessing letter recognition using the DRDP, a teacher can:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-500">
                  <li>Enter the student's baseline DRDP assessment score</li>
                  <li>View the appropriate learning ladder for letter recognition</li>
                  <li>Identify the specific target (e.g., "identify letter A by name")</li>
                  <li>Collect opportunity-based data during instruction</li>
                  <li>Receive notifications when the student meets the threshold for advancement</li>
                  <li>Progress to the next letter in the sequence</li>
                </ol>
                <p className="text-base text-gray-500 mt-4">
                  Instead of the vague DRDP measure of "identifies some letters," teachers now have concrete, progressive targets leading to mastery of all 26 letters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>© 2025 K-1 SDC Assessment. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 