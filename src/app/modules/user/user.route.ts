import express from 'express';
import { userControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidation } from '../faculty/faculty.validation';

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

export default UserRoutes;
