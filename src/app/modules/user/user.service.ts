import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given , use default password
  userData.password = password || (config.default_password as string);
  // set user role
  userData.role = 'student';

  // set generated id;
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new Error('Admission semester not found');
  }

  userData.id = await generateStudentId(admissionSemester);

  // create a user
  const createNewUser = await User.create(userData);

  // create a student
  if (Object.keys(createNewUser).length) {
    // set id , _id as user
    payload.id = createNewUser.id; // embedding user id as id field in student model
    payload.user = createNewUser._id; // reference user _id as user field in student model

    // create a student
    const createNewStudent = await Student.create(payload);
    return createNewStudent;
  }
};

export const userServices = {
  createStudentIntoDB,
};
