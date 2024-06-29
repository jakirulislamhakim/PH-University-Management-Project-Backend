import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { semesterRegistrationControllers } from './semesterRegistration.controller';
import { semesterRegistrationValidation } from './semesterRegistration.validation';

const SemesterRegistrationRoutes = Router();

SemesterRegistrationRoutes.post(
  '/create-semester-registration',
  validateRequest(
    semesterRegistrationValidation.createSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.createSemesterRegistration,
);

SemesterRegistrationRoutes.get(
  '/',
  semesterRegistrationControllers.getAllSemesterRegistration,
);

SemesterRegistrationRoutes.get(
  '/:id',
  semesterRegistrationControllers.getSingleSemesterRegistration,
);

SemesterRegistrationRoutes.patch(
  '/:id',
  validateRequest(
    semesterRegistrationValidation.updateSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.updateSpecificSemesterRegistration,
);

export default SemesterRegistrationRoutes;
