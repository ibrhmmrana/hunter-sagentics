/**
 * Redirects authenticated users away from login/signup pages
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

type Props = {
  children: React.ReactNode;
};

export default function AuthRedirect({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    // User is authenticated, redirect to dashboard (home)
    return <Navigate to="/app/home" replace />;
  }

  return <>{children}</>;
}
