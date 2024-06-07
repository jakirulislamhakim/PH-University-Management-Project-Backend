import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { academicDepartmentValidation } from './academicDepartment.validation';
import { academicDepartmentControllers } from './academicDepartment.controller';

const AcademicDepartmentRoutes = Router();

AcademicDepartmentRoutes.post(
  '/create-academic-department',
  validateRequest(
    academicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  academicDepartmentControllers.createAcademicDepartment,
);
AcademicDepartmentRoutes.get(
  '/',
  academicDepartmentControllers.getAllAcademicDepartment,
);
AcademicDepartmentRoutes.get(
  '/:academicDepartmentId',
  academicDepartmentControllers.getSingleAcademicDepartment,
);
AcademicDepartmentRoutes.patch(
  '/:academicDepartmentId',
  validateRequest(
    academicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  academicDepartmentControllers.updateAllAcademicDepartment,
);

export default AcademicDepartmentRoutes;
