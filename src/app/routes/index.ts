import { Router } from 'express';
import { studentRoutes } from '../modules/student/student.route';
import userRoutes from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/students',
    route: studentRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
];

// router.use('/students', studentRoutes)
// router.use('/users', userRoutes)

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
