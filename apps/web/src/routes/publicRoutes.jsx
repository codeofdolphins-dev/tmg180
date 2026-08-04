import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import CheckYourEmail from '../pages/CheckYourEmail';
import ResetPassword from '../pages/ResetPassword';
import CreateNewPassword from '../pages/CreateNewPassword';
import PasswordUpdated from '../pages/PasswordUpdated';
import RoleSelection from '../pages/RoleSelection';
import ChooseWorkspace from '../pages/ChooseWorkspace';
import LinkExpired from '../pages/LinkExpired';
import SomethingWentWrong from '../pages/SomethingWentWrong';
import { PUBLIC_PATHS as P } from './paths';

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
