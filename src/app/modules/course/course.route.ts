import { Router } from 'express';
import { courseControllers } from './course.controller';
import validateRequest from '../../middleware/validateRequest';
import { courseValidation } from './course.validation';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.constant';

const CourseRoutes = Router();

CourseRoutes.post(
  '/create-course',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(courseValidation.createCourseValidationSchema),
  courseControllers.createCourse,
);

CourseRoutes.get(
  '/',
  auth(UserRole.student, UserRole.admin, UserRole.superAdmin, UserRole.faculty),
  courseControllers.getAllCourse,
);

CourseRoutes.get(
  '/:id',
  auth(UserRole.student, UserRole.admin, UserRole.superAdmin, UserRole.faculty),
  courseControllers.getSingleCourse,
);

CourseRoutes.delete(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  courseControllers.deleteSpecificCourse,
);

CourseRoutes.patch(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(courseValidation.updateCourseValidationSchema),
  courseControllers.updateSpecificCourse,
);

CourseRoutes.put(
  '/:courseId/assign-faculties',
  validateRequest(courseValidation.courseWithFacultyValidationSchema),
  auth(UserRole.admin, UserRole.superAdmin),
  courseControllers.assignFacultiesWithCourse,
);

CourseRoutes.get(
  '/:courseId/get-faculties',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.student, UserRole.faculty),
  courseControllers.getFacultiesWithCourse,
);

CourseRoutes.delete(
  '/:courseId/remove-faculties',
  validateRequest(courseValidation.courseWithFacultyValidationSchema),
  auth(UserRole.admin, UserRole.superAdmin),
  courseControllers.removeFacultiesWithCourse,
);

export default CourseRoutes;
