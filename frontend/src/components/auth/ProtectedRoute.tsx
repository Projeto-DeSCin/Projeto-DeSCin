import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import type { Role } from '../../types';

interface Props {
  children: React.ReactNode;
  requiredRole?: Role;
}

export function ProtectedRoute({ children, requiredRole }: Props) {
  const { isAuthenticated, hasRole } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && !hasRole(requiredRole)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
