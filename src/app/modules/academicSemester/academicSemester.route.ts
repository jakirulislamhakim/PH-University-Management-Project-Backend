import { Router } from 'express';
import { academicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import { academicSemesterValidations } from './academicSemester.validaation';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.constant';

const AcademicSemesterRoutes = Router();

// create semester route
AcademicSemesterRoutes.post(
  '/create-academic-semester',
  validateRequest(
    academicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  auth(UserRole.admin, UserRole.superAdmin),
  academicSemesterControllers.createAcademicSemester,
);
// get all semester route
AcademicSemesterRoutes.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  academicSemesterControllers.getAllAcademicSemester,
);
// get single semester route
AcademicSemesterRoutes.get(
  '/:semesterId',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.faculty),
  academicSemesterControllers.getSingleAcademicSemester,
);
// update semester route
AcademicSemesterRoutes.patch(
  '/:semesterId',
  validateRequest(
    academicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  auth(UserRole.admin, UserRole.superAdmin),
  academicSemesterControllers.updateAcademicSemester,
);

export default AcademicSemesterRoutes;
