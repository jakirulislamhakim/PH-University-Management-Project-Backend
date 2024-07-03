import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { offeredCourseValidation } from './offeredCourse.validation';
import { offeredCourseControllers } from './offeredCourse.controller';

const router = Router();

router.post(
  '/create-offered-course',
  validateRequest(offeredCourseValidation.createOfferedCourseValidationSchema),
  offeredCourseControllers.createOfferedCourse,
);

router.get('/', offeredCourseControllers.getAllOfferedCourse);

router.get('/:id', offeredCourseControllers.getSingleOfferedCourse);

router.patch(
  '/:id',
  validateRequest(offeredCourseValidation.updateOfferedCourseValidationSchema),
  offeredCourseControllers.updateSpecificOfferedCourse,
);

export const OfferedCourseRoutes = router;
