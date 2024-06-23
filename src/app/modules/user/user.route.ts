import express from 'express';
import { userControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidation } from '../faculty/faculty.validation';
import { adminValidations } from '../admin/admin.validation';

const UserRoutes = express.Router();

UserRoutes.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
);

UserRoutes.post(
  '/create-faculty',
  validateRequest(facultyValidation.createFacultyValidationSchema),
  userControllers.createFaculty,
);

UserRoutes.post(
  '/create-admin',
  validateRequest(adminValidations.createAdminValidationSchema),
  userControllers.createAdmin,
);

export default UserRoutes;
