import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Opening a new screen puts you at the top of it.
 *
 * The portal layouts fix the sidebar and top bar and let the document scroll,
 * so a route change swaps the page content without moving the scrollbar — open
 * a profile section from halfway down the hub and it lands you halfway down the
 * section. React Router only restores scroll for data routers
 * (`<ScrollRestoration/>` needs `createBrowserRouter`), and this app mounts
 * `<BrowserRouter>` with a `<Routes>` tree, so it does it here instead.
 *
 * Back and forward are left alone: those are `POP`, and the browser's own
 * `history.scrollRestoration` already returns you to where you were, which is
 * what going back is for.
 *
 * Only a changed pathname counts. A screen that writes to its own query string
 * — a filter, a tab — is not a new screen and must not throw the reader back to
 * the top.
 */
export default function ScrollToTop() {
  const { pathname, state } = useLocation();
  const keepScroll = state?.keepScroll === true;
  const navigationType = useNavigationType();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (navigationType === 'POP') return;
    // A screen that saves itself and swaps its own URL — "new log" becoming
    // "log 12" on first save — has not gone anywhere, so it says so and keeps
    // the reader where they were typing.
    if (keepScroll) return;

    // Instant, not smooth: this is arriving somewhere new, not travelling
    // through the old page on the way.
    globalThis.scrollTo?.({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, navigationType, keepScroll]);

  return null;
}
