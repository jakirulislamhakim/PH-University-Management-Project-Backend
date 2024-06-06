import { Router } from 'express';
import { academicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validation';

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
