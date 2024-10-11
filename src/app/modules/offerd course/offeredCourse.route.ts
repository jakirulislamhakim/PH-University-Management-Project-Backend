import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { offeredCourseValidation } from './offeredCourse.validation';
import { offeredCourseControllers } from './offeredCourse.controller';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.constant';

const router = Router();

router.post(
  '/create-offered-course',
  validateRequest(offeredCourseValidation.createOfferedCourseValidationSchema),
  auth(UserRole.admin, UserRole.superAdmin),
  offeredCourseControllers.createOfferedCourse,
);

router.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.faculty),
  offeredCourseControllers.getAllOfferedCourse,
);

router.get(
  '/my-offered-courses',
  auth(UserRole.student),
  offeredCourseControllers.getMyOfferedCourseForStudent,
);

router.get(
  '/my-enrolled-courses',
  auth(UserRole.student),
  offeredCourseControllers.getMyEnrolledCourseForStudent,
);

router.get(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.faculty, UserRole.student),
  offeredCourseControllers.getSingleOfferedCourse,
);

router.patch(
  '/:id',
  validateRequest(offeredCourseValidation.updateOfferedCourseValidationSchema),
  auth(UserRole.admin, UserRole.superAdmin),
  offeredCourseControllers.updateSpecificOfferedCourse,
);

export const OfferedCourseRoutes = router;
