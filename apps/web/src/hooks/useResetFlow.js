import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPassword, useResetTokenCheck } from './auth';
import { PUBLIC_PATHS } from '../routes/paths';

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

  const check = useResetTokenCheck(token);
  const reset = useResetPassword();

  const invalid = !token || check.isError;

  useEffect(() => {
    // The Link Expired frame is written for revoked share links, so tell it
    // which kind of link failed and it swaps to reset-appropriate copy.
    if (invalid) {
      navigate(PUBLIC_PATHS.linkExpired, { replace: true, state: { reason: 'password_reset' } });
    }
  }, [invalid, navigate]);

  const submit = async (password) => {
    await reset.mutateAsync({ token, password });
    navigate(PUBLIC_PATHS.passwordUpdated, { replace: true });
  };

  return {
    token,
    /** True while the link is being checked — hold the form until it clears. */
    isChecking: Boolean(token) && check.isPending,
    isValid: check.isSuccess,
    submit,
    error: reset.error,
    isSaving: reset.isPending,
  };
}
