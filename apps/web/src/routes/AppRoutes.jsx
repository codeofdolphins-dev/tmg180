import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../store';
import { PUBLIC_PATHS } from './paths';
import RequireRole, { RequireSession, RootRedirect } from './RequireRole';
import { publicRoutes, sessionRoutes } from './auth/publicRoutes';
import { participantRoutes, participantStandaloneRoutes } from './participant/participantRoutes';
import ParticipantLayout from '../components/layout/participant/ParticipantLayout';
import { workerRoutes, workerStandaloneRoutes } from './worker/workerRoutes';
import WorkerLayout from '../components/layout/worker/WorkerLayout';
import { adminRoutes, adminStandaloneRoutes } from './admin/adminRoutes';
import GovernanceLayout from '../components/layout/admin/GovernanceLayout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      <Route element={<RequireSession />}>
        {sessionRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      <Route path="/participant" element={<RequireRole role={ROLES.PARTICIPANT} />}>
        {/* Shared portal chrome; pages render into its <Outlet />. */}
        <Route element={<ParticipantLayout />}>
          {participantRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
        {participantStandaloneRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      <Route path="/worker" element={<RequireRole role={ROLES.WORKER} />}>
        {/* Shared workspace chrome; pages render into its <Outlet />. */}
        <Route element={<WorkerLayout />}>
          {workerRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
        {workerStandaloneRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      <Route path="/admin" element={<RequireRole role={ROLES.ADMIN} />}>
        {/* Shared portal chrome; pages render into its <Outlet />. */}
        <Route element={<GovernanceLayout />}>
          {adminRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
        {adminStandaloneRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      <Route path="*" element={<Navigate to={PUBLIC_PATHS.error} replace />} />
    </Routes>
  );
}
