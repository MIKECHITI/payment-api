import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <>
      <div style={{ width: '100%', maxWidth: 1024 }} className="page-container">
        <Navbar />
        <Outlet />
      </div>
    </>
  );
}
