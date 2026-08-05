import SignIn from '../../pages/auth/SignIn';
import SignUp from '../../pages/auth/SignUp';
import ForgotPassword from '../../pages/auth/ForgotPassword';
import CheckYourEmail from '../../pages/auth/CheckYourEmail';
import ResetPassword from '../../pages/auth/ResetPassword';
import CreateNewPassword from '../../pages/auth/CreateNewPassword';
import PasswordUpdated from '../../pages/auth/PasswordUpdated';
import RoleSelection from '../../pages/auth/RoleSelection';
import ChooseWorkspace from '../../pages/auth/ChooseWorkspace';
import LinkExpired from '../../pages/auth/LinkExpired';
import SomethingWentWrong from '../../pages/auth/SomethingWentWrong';
import { PUBLIC_PATHS as P } from '../paths';

/** Auth flow + share-link/system states. No session required. */
export const publicRoutes = [
  { path: P.signIn, element: <SignIn /> },
  { path: P.signUp, element: <SignUp /> },
  { path: P.forgotPassword, element: <ForgotPassword /> },
  { path: P.checkEmail, element: <CheckYourEmail /> },
  { path: P.resetPassword, element: <ResetPassword /> },
  { path: P.createNewPassword, element: <CreateNewPassword /> },
  { path: P.passwordUpdated, element: <PasswordUpdated /> },
  { path: P.linkExpired, element: <LinkExpired /> },
  { path: P.error, element: <SomethingWentWrong /> },
];

/**
 * Workspace pickers. These show what an account holds, so they need a session —
 * they are not a way in.
 */
export const sessionRoutes = [
  { path: P.roleSelection, element: <RoleSelection /> },
  { path: P.chooseWorkspace, element: <ChooseWorkspace /> },
];
