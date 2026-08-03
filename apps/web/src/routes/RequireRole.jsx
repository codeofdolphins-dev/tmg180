import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { PUBLIC_PATHS, DASHBOARD_BY_ROLE } from './paths';

/**
 * Route guard for a role-namespaced branch.
 * Not signed in -> sign-in. Signed in without a role -> role selection.
 * Signed in with a different role -> that role's own dashboard.
 */
export default function RequireRole({ role }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const activeRole = useAuthStore((s) => s.role);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PUBLIC_PATHS.signIn} state={{ from: location }} replace />;
  }
  if (!activeRole) {
    return <Navigate to={PUBLIC_PATHS.roleSelection} replace />;
  }
  if (activeRole !== role) {
    return <Navigate to={DASHBOARD_BY_ROLE[activeRole]} replace />;
  }
  return <Outlet />;
}

/** "/" entry: send the visitor wherever their session says they belong. */
export function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const activeRole = useAuthStore((s) => s.role);

  if (!isAuthenticated) return <Navigate to={PUBLIC_PATHS.signIn} replace />;
  if (!activeRole) return <Navigate to={PUBLIC_PATHS.roleSelection} replace />;
  return <Navigate to={DASHBOARD_BY_ROLE[activeRole]} replace />;
}
