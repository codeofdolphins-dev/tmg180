import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './store';

/**
 * Re-validates any persisted session against the API before the app settles.
 * Rendering continues while it is in flight — the guards already have enough
 * from localStorage to route, and a revoked session signs itself out the moment
 * the answer arrives.
 */
function App() {
  useEffect(() => {
    const { isAuthenticated, refreshSession } = useAuthStore.getState();
    if (isAuthenticated) refreshSession();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
