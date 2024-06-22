import { Router } from 'express';
import { facultyControllers } from './faculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidation } from './faculty.validation';

const FacultyRoutes = Router();

FacultyRoutes.get('/', facultyControllers.getAllFaculty);
FacultyRoutes.get('/:id', facultyControllers.getSingleFaculty);
FacultyRoutes.patch(
  '/:id',
  validateRequest(facultyValidation.updateFacultyValidationSchema),
  facultyControllers.updateSpecificFacultyById,
);
FacultyRoutes.delete('/:id', facultyControllers.deleteSpecificFacultyById);

export default FacultyRoutes;
