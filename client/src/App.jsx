import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import JeopardyGame from './components/JeopardyGame'
import AdminPanel from './components/AdminPanel'
import Login from './components/Login'
import Signup from './components/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './components/LandingPage';

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={
        user ? <JeopardyGame /> : <LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminPanel />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App