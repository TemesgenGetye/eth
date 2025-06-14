import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (user?.id) localStorage.setItem('user-id', user.id);

  if (loading) return null; // or a loading spinner if you prefer
  if (user === null) return <Navigate to="/login" replace />;
  return children;
};
