import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { academicDepartmentValidation } from './academicDepartment.validation';
import { academicDepartmentControllers } from './academicDepartment.controller';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.constant';

const AcademicDepartmentRoutes = Router();

AcademicDepartmentRoutes.post(
  '/create-academic-department',
  validateRequest(
    academicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  auth(UserRole.admin, UserRole.superAdmin),
  academicDepartmentControllers.createAcademicDepartment,
);
AcademicDepartmentRoutes.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  academicDepartmentControllers.getAllAcademicDepartment,
);
AcademicDepartmentRoutes.get(
  '/:academicDepartmentId',
  auth(UserRole.admin, UserRole.superAdmin),
  academicDepartmentControllers.getSingleAcademicDepartment,
);
AcademicDepartmentRoutes.patch(
  '/:academicDepartmentId',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(
    academicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  academicDepartmentControllers.updateAllAcademicDepartment,
);

export default AcademicDepartmentRoutes;
