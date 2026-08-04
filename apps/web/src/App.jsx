import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useSessionSync } from './hooks/auth';

/**
 * Re-validates any persisted session against the API before the app settles.
 * Rendering continues while it is in flight — the guards already have enough
 * from localStorage to route, and a revoked session signs itself out the moment
 * the answer arrives.
 */
function SessionSync({ children }) {
  useSessionSync();
  return children;
}

function App() {
  return (
    <SessionSync>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SessionSync>
  );
}

export default App;
