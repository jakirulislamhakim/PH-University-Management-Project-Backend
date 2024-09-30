import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middleware/auth';

const router = express.Router();

router.get('/', auth('admin'), StudentControllers.getAllStudents);

router.get(
  '/:id',
  auth('admin', 'faculty'),
  StudentControllers.getSingleStudent,
);

router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudentById,
);

router.delete('/:id', StudentControllers.deleteSpecificStudentById);

export const StudentRoutes = router;
