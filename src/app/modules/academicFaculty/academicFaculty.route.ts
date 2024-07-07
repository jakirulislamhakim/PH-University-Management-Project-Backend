import { Router } from 'express';
import { academicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validation';
import auth from '../../middleware/auth';

const AcademicFacultyRoutes = Router();

AcademicFacultyRoutes.post(
  '/create-academic-faculty',
  validateRequest(
    academicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  academicFacultyControllers.createAcademicFaculty,
);
AcademicFacultyRoutes.get(
  '/',
  auth(),
  academicFacultyControllers.getAllAcademicFaculties,
);
AcademicFacultyRoutes.get(
  '/:academicFacultyId',
  academicFacultyControllers.getSingleAcademicFaculty,
);
AcademicFacultyRoutes.patch(
  '/:academicFacultyId',
  validateRequest(
    academicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  academicFacultyControllers.updateAllAcademicFaculty,
);

export default AcademicFacultyRoutes;
