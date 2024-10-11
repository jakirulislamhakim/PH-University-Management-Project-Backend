import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { semesterRegistrationControllers } from './semesterRegistration.controller';
import { semesterRegistrationValidation } from './semesterRegistration.validation';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.constant';

const SemesterRegistrationRoutes = Router();

SemesterRegistrationRoutes.post(
  '/create-semester-registration',
  validateRequest(
    semesterRegistrationValidation.createSemesterRegistrationValidationSchema,
  ),
  auth(UserRole.admin, UserRole.superAdmin),
  semesterRegistrationControllers.createSemesterRegistration,
);

SemesterRegistrationRoutes.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.student, UserRole.faculty),
  semesterRegistrationControllers.getAllSemesterRegistration,
);

SemesterRegistrationRoutes.get(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.student, UserRole.faculty),
  semesterRegistrationControllers.getSingleSemesterRegistration,
);

SemesterRegistrationRoutes.patch(
  '/:id',
  validateRequest(
    semesterRegistrationValidation.updateSemesterRegistrationValidationSchema,
  ),
  auth(UserRole.admin, UserRole.superAdmin),
  semesterRegistrationControllers.updateSpecificSemesterRegistration,
);

export default SemesterRegistrationRoutes;
