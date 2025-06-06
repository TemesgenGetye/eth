import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  console.log(user);

  if (loading) return null; // or a loading spinner if you prefer
  if (user === null) return <Navigate to="/login" replace />;
  return children;
};
