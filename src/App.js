import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FeatureChecklist from './components/FeatureChecklist';
import DrdpDomains from './components/DrdpDomains';
import AdminDashboard from './components/AdminDashboard';
import TeacherClassroom from './components/TeacherClassroom';

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/features"
          element={<FeatureChecklist />}
        />
        <Route
          path="/drdp-domains"
          element={<DrdpDomains />}
        />
        <Route
          path="/admin"
          element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/classroom"
          element={isAuthenticated ? <TeacherClassroom /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App; 