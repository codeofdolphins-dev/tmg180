import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/apiClient';
import { PUBLIC_PATHS } from '../../routes/paths';

/**
 * Shared behaviour for the two screens that consume a reset link (Create New
 * Password and Reset Password are separate Figma frames doing the same job).
 *
 * The link is checked before the form is shown, so an expired one lands on Link
 * Expired rather than failing after someone has typed a new password twice.
 */
export function useResetFlow() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token');

  const [isChecking, setIsChecking] = useState(Boolean(token));
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // The Link Expired frame is written for revoked share links, so tell it
    // which kind of link failed and it swaps to reset-appropriate copy.
    const expired = () =>
      navigate(PUBLIC_PATHS.linkExpired, { replace: true, state: { reason: 'password_reset' } });

    if (!token) {
      expired();
      return;
    }

    let active = true;
    api.auth
      .verifyResetToken(token)
      .then(() => {
        if (!active) return;
        setIsValid(true);
        setIsChecking(false);
      })
      .catch(() => {
        if (active) expired();
      });

    return () => {
      active = false;
    };
  }, [token, navigate]);

  const submit = async (password) => {
    setIsSaving(true);
    setError(null);
    try {
      await api.auth.resetPassword(token, password);
      navigate(PUBLIC_PATHS.passwordUpdated, { replace: true });
    } catch (failure) {
      setError(failure);
      setIsSaving(false);
    }
  };

  return { token, isChecking, isValid, submit, error, isSaving };
}
