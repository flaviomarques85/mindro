import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider } from './contexts/AuthContext';
import RestrictedLayout from './layouts/RestrictedLayout';
import StudentDetailPage from './pages/StudentDetailPage';
import './App.css';
import StudentsPage from './pages/StudentsPage';
import PrivateRoute from './components/PrivateRoute';
import LessonsPage from './pages/LessonsPage';
import TasksPage from './pages/TasksPage';
import PaymentsPage from './pages/PaymentsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><RestrictedLayout><DashboardPage /></RestrictedLayout></PrivateRoute>} />
          <Route path="/students" element={<PrivateRoute><RestrictedLayout><StudentsPage /></RestrictedLayout></PrivateRoute>} />
          <Route path="/students/:id" element={<PrivateRoute><RestrictedLayout><StudentDetailPage /></RestrictedLayout></PrivateRoute>} />
          <Route path="/lessons" element={<PrivateRoute><RestrictedLayout><LessonsPage /></RestrictedLayout></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><RestrictedLayout><TasksPage /></RestrictedLayout></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><RestrictedLayout><PaymentsPage /></RestrictedLayout></PrivateRoute>} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
