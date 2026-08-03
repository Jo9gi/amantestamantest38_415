import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { ROUTES } from '../constants';
import { LoadingSpinner } from './common';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-secondary-900 mb-2">Loading</h2>
          <p className="text-secondary-600">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}
