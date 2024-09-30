import express from 'express';
import { userControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidation } from '../faculty/faculty.validation';
import { adminValidations } from '../admin/admin.validation';
import auth from '../../middleware/auth';
import { UserRole } from './user.constant';
import { userValidation } from './user.validation';

const UserRoutes = express.Router();

UserRoutes.post(
  '/create-student',
  auth(UserRole.admin),
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
);

UserRoutes.post(
  '/create-faculty',
  auth(UserRole.faculty, UserRole.admin),
  validateRequest(facultyValidation.createFacultyValidationSchema),
  userControllers.createFaculty,
);

UserRoutes.post(
  '/create-admin',
  // NOTE: super admin
  validateRequest(adminValidations.createAdminValidationSchema),
  userControllers.createAdmin,
);

UserRoutes.get(
  '/me',
  auth('student', 'admin', 'faculty'),
  userControllers.getMe,
);

UserRoutes.post(
  '/change-status/:id',
  validateRequest(userValidation.changeUserStatusValidationSchema),
  auth('admin'),
  userControllers.changeUserStatus,
);

export default UserRoutes;
