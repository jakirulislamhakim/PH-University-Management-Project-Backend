import { Router } from 'express';
import { courseControllers } from './course.controller';
import validateRequest from '../../middleware/validateRequest';
import { courseValidation } from './course.validation';
import auth from '../../middleware/auth';

const CourseRoutes = Router();

CourseRoutes.post(
  '/create-course',
  auth('admin'),
  validateRequest(courseValidation.createCourseValidationSchema),
  courseControllers.createCourse,
);
CourseRoutes.get(
  '/',
  auth('admin', 'faculty', 'student'),
  courseControllers.getAllCourse,
);
CourseRoutes.get(
  '/:id',
  auth('admin', 'faculty', 'student'),
  courseControllers.getSingleCourse,
);
CourseRoutes.delete('/:id', courseControllers.deleteSpecificCourse);
CourseRoutes.patch(
  '/:id',
  auth('admin'),
  validateRequest(courseValidation.updateCourseValidationSchema),
  courseControllers.updateSpecificCourse,
);

CourseRoutes.put(
  '/:courseId/assign-faculties',
  validateRequest(courseValidation.courseWithFacultyValidationSchema),
  courseControllers.assignFacultiesWithCourse,
);
CourseRoutes.delete(
  '/:courseId/remove-faculties',
  auth('admin'),
  validateRequest(courseValidation.courseWithFacultyValidationSchema),
  courseControllers.removeFacultiesWithCourse,
);

export default CourseRoutes;
