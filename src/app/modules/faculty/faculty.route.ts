import { Router } from 'express';
import { facultyControllers } from './faculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidation } from './faculty.validation';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.constant';

const FacultyRoutes = Router();

FacultyRoutes.get(
  '/',
  auth(UserRole.admin, UserRole.faculty),

  facultyControllers.getAllFaculty,
);
FacultyRoutes.get('/:id', facultyControllers.getSingleFaculty);

FacultyRoutes.patch(
  '/:id',
  validateRequest(facultyValidation.updateFacultyValidationSchema),
  facultyControllers.updateSpecificFacultyById,
);

FacultyRoutes.delete('/:id', facultyControllers.deleteSpecificFacultyById);

export default FacultyRoutes;
