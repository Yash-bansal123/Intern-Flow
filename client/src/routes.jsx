import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProfilePage from './pages/profile/ProfilePage';
import PortfolioPage from './pages/portfolio/PortfolioPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetailsPage from './pages/projects/ProjectDetailsPage';
import KanbanBoard from './pages/tasks/KanbanBoard';
import InternshipDashboard from './pages/internships/InternshipDashboard';
import SkillGraph from './pages/growth/SkillGraph';
import PlacementDashboard from './pages/placement/PlacementDashboard';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';

import DashboardPage from './pages/dashboard/DashboardPage';

const NotFound = () => <div style={{ padding: '20px' }}><h2>404 Not Found</h2></div>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/portfolio/:uuid" element={<PortfolioPage />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailsPage />} />
        <Route path="projects/:projectId/kanban" element={<KanbanBoard />} />
        <Route path="tasks" element={<KanbanBoard />} />
        <Route path="internship" element={<InternshipDashboard />} />
        <Route path="analytics" element={<SkillGraph />} />
        <Route path="placement" element={<PlacementDashboard />} />
        <Route path="reports" element={<AnalyticsDashboard />} />
        {/* Other routes will go here */}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
