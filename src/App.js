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

// Auth service to check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Function to check if user has required role
const hasRole = (role) => {
  const userRole = localStorage.getItem('userRole');
  return userRole === role;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/drdp-domains"
          element={isAuthenticated() ? <DrdpDomains /> : <Navigate to="/login" />}
        />
        <Route
          path="/essential-skills"
          element={isAuthenticated() ? <EssentialSkillsAssessment /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={
            isAuthenticated() && hasRole('admin')
              ? <AdminDashboard />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="/classroom"
          element={
            isAuthenticated() && hasRole('teacher')
              ? <TeacherClassroom />
              : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App; 