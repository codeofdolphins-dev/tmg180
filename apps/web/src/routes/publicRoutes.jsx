import SignIn from '../pages/SignIn';
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

/** Auth flow + role selection + share-link/system states. No session required. */
export const publicRoutes = [
  { path: P.signIn, element: <SignIn /> },
  { path: P.forgotPassword, element: <ForgotPassword /> },
  { path: P.checkEmail, element: <CheckYourEmail /> },
  { path: P.resetPassword, element: <ResetPassword /> },
  { path: P.createNewPassword, element: <CreateNewPassword /> },
  { path: P.passwordUpdated, element: <PasswordUpdated /> },
  { path: P.roleSelection, element: <RoleSelection /> },
  { path: P.chooseWorkspace, element: <ChooseWorkspace /> },
  { path: P.linkExpired, element: <LinkExpired /> },
  { path: P.error, element: <SomethingWentWrong /> },
];
