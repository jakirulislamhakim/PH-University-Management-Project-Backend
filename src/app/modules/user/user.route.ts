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
  auth(UserRole.admin),
  upload.single('file'),
  parseBodyDataTextToJson,
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
);

UserRoutes.post(
  '/create-faculty',
  auth(UserRole.faculty, UserRole.admin),
  upload.single('file'),
  parseBodyDataTextToJson,
  validateRequest(facultyValidation.createFacultyValidationSchema),
  userControllers.createFaculty,
);

UserRoutes.post(
  '/create-admin',
  // fixme: super admin
  upload.single('file'),
  parseBodyDataTextToJson,
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
