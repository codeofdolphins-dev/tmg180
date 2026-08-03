import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { canUseRole } from '@tmg180/shared';
import { useAuthStore } from '../store';
import { PUBLIC_PATHS, DASHBOARD_BY_ROLE } from './paths';

/**
 * Route guard for a role-namespaced branch.
 * Not signed in -> sign-in. No usable workspace open -> workspace picker.
 * Signed in with a different workspace open -> that workspace's dashboard.
 */
export default function RequireRole({ role }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const roles = useAuthStore((s) => s.roles);
  const activeRole = useAuthStore((s) => s.role);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PUBLIC_PATHS.signIn} state={{ from: location }} replace />;
  }
  // Covers "no workspace open yet" and a stored role the account doesn't hold.
  if (!canUseRole(roles, activeRole)) {
    return <Navigate to={PUBLIC_PATHS.chooseWorkspace} replace />;
  }
  if (activeRole !== role) {
    return <Navigate to={DASHBOARD_BY_ROLE[activeRole]} replace />;
  }
  return <Outlet />;
}

/** Signed in, but no particular workspace required — the pickers live here. */
export function RequireSession() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PUBLIC_PATHS.signIn} state={{ from: location }} replace />;
  }
  return <Outlet />;
}

/** "/" entry: send the visitor wherever their session says they belong. */
export function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const roles = useAuthStore((s) => s.roles);
  const activeRole = useAuthStore((s) => s.role);

  if (!isAuthenticated) return <Navigate to={PUBLIC_PATHS.signIn} replace />;
  if (!canUseRole(roles, activeRole)) return <Navigate to={PUBLIC_PATHS.chooseWorkspace} replace />;
  return <Navigate to={DASHBOARD_BY_ROLE[activeRole]} replace />;
}
