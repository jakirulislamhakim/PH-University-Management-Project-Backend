import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given , use default password
  userData.password = password || (config.default_password as string);
  // set user role
  userData.role = 'student';
  // set manually generated id;
  userData.id = '2030010001';

  // create a user
  const createNewUser = await User.create(userData);

  // create a student
  if (Object.keys(createNewUser).length) {
    // set id , _id as user
    studentData.id = createNewUser.id; // embedding user id as id field in student model
    studentData.user = createNewUser._id; // reference user _id as user field in student model

    const createNewStudent = await Student.create(studentData);
    return createNewStudent;
  }
};

export const userServices = {
  createStudentIntoDB,
};
