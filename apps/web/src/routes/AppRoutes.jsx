import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../store';
import { PUBLIC_PATHS } from './paths';
import RequireRole, { RequireSession, RootRedirect } from './RequireRole';
import { publicRoutes, sessionRoutes } from './publicRoutes';
import { participantRoutes } from './participantRoutes';
import { workerRoutes } from './workerRoutes';
import { adminRoutes } from './adminRoutes';

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
        {participantRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      <Route path="/worker" element={<RequireRole role={ROLES.WORKER} />}>
        {workerRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      <Route path="/admin" element={<RequireRole role={ROLES.ADMIN} />}>
        {adminRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      <Route path="*" element={<Navigate to={PUBLIC_PATHS.error} replace />} />
    </Routes>
  );
}
