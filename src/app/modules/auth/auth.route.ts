import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { authValidation } from './auth.validation';
import { authControllers } from './auth.controller';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.constant';

const router = Router();

router.post(
  '/login',
  validateRequest(authValidation.loginUserValidationSchema),
  authControllers.loginUser,
);

router.post(
  '/change-password',
  auth(UserRole.admin, UserRole.faculty, UserRole.student),
  validateRequest(authValidation.changePasswordValidationSchema),
  authControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenValidationSchema),
  authControllers.refreshToken,
);

export const AuthRoutes = router;
