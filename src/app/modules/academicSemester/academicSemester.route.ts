import { Router } from 'express';
import { academicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import { academicSemesterValidations } from './academicSemester.validaation';

const AcademicSemesterRoutes = Router();

// create semester route
AcademicSemesterRoutes.post(
  '/create-academic-semester',
  validateRequest(
    academicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  academicSemesterControllers.createAcademicSemester,
);
// get all semester route
AcademicSemesterRoutes.get(
  '/',
  academicSemesterControllers.getAllAcademicSemester,
);
// get single semester route
AcademicSemesterRoutes.get(
  '/:semesterId',
  academicSemesterControllers.getSingleAcademicSemester,
);
// update semester route
AcademicSemesterRoutes.patch(
  '/:semesterId',
  validateRequest(
    academicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  academicSemesterControllers.updateAcademicSemester,
);

export default AcademicSemesterRoutes;
