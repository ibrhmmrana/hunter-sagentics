/**
 * Route guard component that protects app routes from unauthenticated access
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login with the current location so we can redirect back after auth
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
