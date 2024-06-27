import { Router } from 'express';
import { courseControllers } from './course.controller';
import validateRequest from '../../middleware/validateRequest';
import { courseValidation } from './course.validation';

const CourseRoutes = Router();

CourseRoutes.post(
  '/create-course',
  validateRequest(courseValidation.createCourseValidationSchema),
  courseControllers.createCourse,
);
CourseRoutes.get('/', courseControllers.getAllCourse);
CourseRoutes.get('/:id', courseControllers.getSingleCourse);
CourseRoutes.delete('/:id', courseControllers.deleteSpecificCourse);
CourseRoutes.patch(
  '/:id',
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
  validateRequest(courseValidation.courseWithFacultyValidationSchema),
  courseControllers.removeFacultiesWithCourse,
);

export default CourseRoutes;
