import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import AcademicSemesterRoutes from '../modules/academicSemester/academicSemester.route';
import AcademicFacultyRoutes from '../modules/academicFaculty/academicFaculty.route';
import UserRoutes from '../modules/user/user.route';
import AcademicDepartmentRoutes from '../modules/academicDepartment/academicDepartment.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
];

// router.use('/students', studentRoutes)
// router.use('/users', userRoutes)

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
