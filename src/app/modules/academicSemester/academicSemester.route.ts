import { Router } from 'express';
import { academicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import { academicSemesterValidations } from './academicSemester.validaation';

const academicSemesterRoutes = Router();

// create semester route
academicSemesterRoutes.post(
  '/create-academic-semester',
  validateRequest(
    academicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  academicSemesterControllers.createAcademicSemester,
);
// get all semester route
academicSemesterRoutes.get(
  '/',
  academicSemesterControllers.getAllAcademicSemester,
);
// get single semester route
academicSemesterRoutes.get(
  '/:semesterId',
  academicSemesterControllers.getSingleAcademicSemester,
);
// update semester route
academicSemesterRoutes.patch(
  '/:semesterId',
  validateRequest(
    academicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  academicSemesterControllers.updateAcademicSemester,
);

export default academicSemesterRoutes;
