import express from 'express';
import { userControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidation } from '../faculty/faculty.validation';
import { adminValidations } from '../admin/admin.validation';
import auth from '../../middleware/auth';
import { UserRole } from './user.constant';
import { userValidation } from './user.validation';
import { upload } from '../../utils/upLoadImageInCloudinary';
import parseBodyDataTextToJson from '../../middleware/parseBodyDataTextToJson';

// create router instance
const UserRoutes = express.Router();

UserRoutes.post(
  '/create-student',
  upload.single('file'),
  parseBodyDataTextToJson,
  validateRequest(studentValidations.createStudentValidationSchema),
  auth(UserRole.admin, UserRole.superAdmin),
  userControllers.createStudent,
);

UserRoutes.post(
  '/create-faculty',
  upload.single('file'),
  parseBodyDataTextToJson,
  validateRequest(facultyValidation.createFacultyValidationSchema),
  auth(UserRole.faculty, UserRole.admin),
  userControllers.createFaculty,
);

UserRoutes.post(
  '/create-admin',
  upload.single('file'),
  parseBodyDataTextToJson,
  validateRequest(adminValidations.createAdminValidationSchema),
  auth(UserRole.superAdmin),
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
