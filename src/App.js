import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DrdpDomains from './components/DrdpDomains';
import EssentialSkillsAssessment from './components/EssentialSkillsAssessment';
import AdminDashboard from './components/AdminDashboard';
import TeacherClassroom from './components/TeacherClassroom';
import { Auth0Provider, useAuth0 } from './utils/authService';

// Protected route component that requires authentication
const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, isLoading, getUserRole } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-indigo-600" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If role is required, check if user has that role
  if (requiredRole && getUserRole() !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return element;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute element={<Dashboard />} />}
      />
      <Route
        path="/drdp-domains"
        element={<ProtectedRoute element={<DrdpDomains />} />}
      />
      <Route
        path="/essential-skills"
        element={<ProtectedRoute element={<EssentialSkillsAssessment />} />}
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute
            element={<AdminDashboard />}
            requiredRole="admin"
          />
        }
      />
      <Route
        path="/classroom"
        element={
          <ProtectedRoute
            element={<TeacherClassroom />}
            requiredRole="teacher"
          />
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <Auth0Provider>
        <AppRoutes />
      </Auth0Provider>
    </Router>
  );
}

export default App; 