import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.superAdmin, UserRole.admin),
  StudentControllers.getAllStudents,
);

router.get(
  '/:id',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty),
  StudentControllers.getSingleStudent,
);

router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  auth(UserRole.superAdmin, UserRole.admin),
  StudentControllers.updateStudentById,
);

router.delete(
  '/:id',
  auth(UserRole.superAdmin, UserRole.admin),
  StudentControllers.deleteSpecificStudentById,
);

export const StudentRoutes = router;
