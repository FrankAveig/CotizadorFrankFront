import { Navigate, Outlet } from 'react-router-dom';
import { useClientAuth } from '../context/ClientAuthContext';
import Loader from '../components/ui/Loader';

export default function ProtectedPortalRoute() {
  const { isAuthenticated, loading } = useClientAuth();

  if (loading) {
    return <Loader fullPage size="lg" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" replace />;
  }

  return <Outlet />;
}
