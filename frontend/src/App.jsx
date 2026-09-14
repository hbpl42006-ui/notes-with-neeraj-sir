import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './layouts/MainLayout';

// Public Pages
import Home from './pages/Home';
import CourseDetails from './pages/CourseDetails';
import Modules from './pages/Modules';
import Materials from './pages/Materials';
import ModuleDetails from './pages/ModuleDetails';
import MaterialDetails from './pages/MaterialDetails';
import Syllabus from './pages/Syllabus';
import Calendar from './pages/Calendar';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminMaterials from './pages/admin/Materials';
import UploadMaterial from './pages/admin/Upload';
import EditMaterial from './pages/admin/Edit';
import AdminSubjects from './pages/admin/Subjects';
import AdminModules from './pages/admin/Modules';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || (!user.is_staff && !user.is_superuser)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/courses/:id" element={<MainLayout><CourseDetails /></MainLayout>} />
            <Route path="/modules" element={<MainLayout><Modules /></MainLayout>} />
            <Route path="/modules/:id" element={<MainLayout><ModuleDetails /></MainLayout>} />
            <Route path="/materials" element={<MainLayout><Materials /></MainLayout>} />
            <Route path="/materials/:id" element={<MainLayout><MaterialDetails /></MainLayout>} />
            <Route path="/syllabus" element={<MainLayout><Syllabus /></MainLayout>} />
            <Route path="/calendar" element={<MainLayout><Calendar /></MainLayout>} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <MainLayout><AdminDashboard /></MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/subjects" 
              element={
                <ProtectedRoute>
                  <MainLayout><AdminSubjects /></MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/modules" 
              element={
                <ProtectedRoute>
                  <MainLayout><AdminModules /></MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/materials" 
              element={
                <ProtectedRoute>
                  <MainLayout><AdminMaterials /></MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/upload" 
              element={
                <ProtectedRoute>
                  <MainLayout><UploadMaterial /></MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route path="/admin/notes/upload" element={<Navigate to="/admin/upload" replace />} />
            <Route path="/admin/notes" element={<Navigate to="/admin/materials" replace />} />
            <Route
              path="/admin/notes/:id/edit"
              element={
                <ProtectedRoute>
                  <MainLayout><EditMaterial /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/admin/edit/:id" 
              element={
                <ProtectedRoute>
                  <MainLayout><EditMaterial /></MainLayout>
                </ProtectedRoute>
              } 
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
