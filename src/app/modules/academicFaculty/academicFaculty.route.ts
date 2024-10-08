import { Router } from 'express';
import { academicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validation';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.constant';

const AcademicFacultyRoutes = Router();

AcademicFacultyRoutes.post(
  '/create-academic-faculty',
  validateRequest(
    academicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  auth(UserRole.superAdmin, UserRole.admin),
  academicFacultyControllers.createAcademicFaculty,
);
AcademicFacultyRoutes.get(
  '/',
  auth(UserRole.superAdmin),
  academicFacultyControllers.getAllAcademicFaculties,
);
AcademicFacultyRoutes.get(
  '/:academicFacultyId',
  auth(UserRole.superAdmin, UserRole.admin),
  academicFacultyControllers.getSingleAcademicFaculty,
);
AcademicFacultyRoutes.patch(
  '/:academicFacultyId',
  validateRequest(
    academicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  auth(UserRole.superAdmin, UserRole.admin),
  academicFacultyControllers.updateAllAcademicFaculty,
);

export default AcademicFacultyRoutes;
