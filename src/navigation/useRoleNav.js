import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { PUBLIC_PATHS } from '../routes/paths';
import { NAV_BY_ROLE, SIGN_OUT } from './navMaps';

/**
 * Returns a navigate-by-sidebar-label function for the given role.
 * Unmapped labels are no-ops; Logout / Sign Out clears the session.
 *
 *   const go = useRoleNav('worker');
 *   <button onClick={() => go(label)}>...
 */
export function useRoleNav(role) {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);

  return (label) => {
    const target = NAV_BY_ROLE[role]?.[label];
    if (!target) return;
    if (target === SIGN_OUT) {
      signOut();
      navigate(PUBLIC_PATHS.signIn);
      return;
    }
    navigate(target);
  };
}
