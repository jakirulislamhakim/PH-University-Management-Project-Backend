import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import mongoose from 'mongoose';

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
    throw new AppError(httpStatus.NOT_FOUND, 'Admission semester not found');
  }

  // start session 
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();
    console.log({ session });
    userData.id = await generateStudentId(admissionSemester);

    // create a user (transaction -1)
    const createNewUser = await User.create([userData], { session });

    // create a student
    if (!createNewUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user")
    }
    // set id , _id as user
    payload.id = createNewUser[0].id; // embedding user id as id field in student model
    payload.user = createNewUser[0]._id; // reference user _id as user field in student model

    // create a student (transaction -2)
    const createNewStudent = await Student.create([payload], { session });

    if (!createNewStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student")
    }

    // commit transaction 
    await session.commitTransaction();
    await session.endSession()
    return createNewStudent;

  } catch (error) {
    await session.abortTransaction();
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
  }
};

export const userServices = {
  createStudentIntoDB,
};
