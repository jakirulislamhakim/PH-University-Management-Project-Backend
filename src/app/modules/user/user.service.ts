import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TMulterFile, TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import mongoose from 'mongoose';
import { TFaculty } from '../faculty/faculty.interface';
import Faculty from '../faculty/faculty.model';
import { Admin } from '../admin/amdin.model';
import { upLoadImageInCloudinary } from '../../utils/upLoadImageInCloudinary';
import AcademicDepartment from '../academicDepartment/academicDepartment.model';

const createStudentIntoDB = async (
  imageInfo: TMulterFile | undefined,
  password: string,
  payload: TStudent,
): Promise<TStudent> => {
  // check email is already use
  const isExistsUser = await User.findOne({ email: payload.email });
  if (isExistsUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      'The user email is already exists.',
    );
  }

  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given , use default password
  userData.password = password || (config.default_password as string);
  // set user role
  userData.role = 'student';
  // set user email
  userData.email = payload.email;

  // set generated id;
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admission semester not found');
  }

  // check academic department is valid
  const isExistsAcademicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );
  if (!isExistsAcademicDepartment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'The Academic department is not found',
    );
  }

  // set academic faculty
  payload.academicFaculty = isExistsAcademicDepartment.academicFaculty;

  // start session
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();
    userData.id = await generateStudentId(admissionSemester);

    // create a user (transaction -1)
    const createNewUser = await User.create([userData], { session });

    // create a student
    if (!createNewUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    if (imageInfo) {
      // upload image in cloudinary
      const imgPublicId = `${createNewUser[0].id}${payload.name.lastName}`;
      const { secure_url } = await upLoadImageInCloudinary(
        imageInfo.path,
        imgPublicId,
      );
      // set image url
      payload.profileImg = secure_url;
    }
    // set id , _id as user
    payload.id = createNewUser[0].id; // embedding user id as id field in student model
    payload.user = createNewUser[0]._id; // reference user _id as user field in student model

    // create a student (transaction -2)
    const createNewStudent = await Student.create([payload], { session });

    if (!createNewStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    // commit transaction
    await session.commitTransaction();
    await session.endSession();
    return createNewStudent[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

// create faculty
const createFacultyIntoDB = async (
  imageInfo: TMulterFile | undefined,
  password: string,
  payload: TFaculty,
): Promise<TFaculty> => {
  // check email is already use
  const isExistsUser = await User.findOne({ email: payload.email });
  if (isExistsUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      'The user email is already exists.',
    );
  }

  const isExistAcademicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );
  if (!isExistAcademicDepartment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'The academic deferment is not found',
    );
  }

  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();

    const generatedFacultyId = await generateFacultyId();

    const user: Partial<TUser> = {
      role: 'faculty',
      id: generatedFacultyId,
      email: payload.email,
      password: password || config.default_password,
    };

    // create user into DB with transaction-1
    const [createUser] = await User.create([user], { session });

    if (imageInfo) {
      // upload image in cloudinary
      const imgPublicId = `${createUser.id}${payload.name.lastName}`;
      const profileImg = await upLoadImageInCloudinary(
        imageInfo.path,
        imgPublicId,
      );
      // set image url
      payload.profileImg = profileImg.secure_url;
    }
    // faculty generateID
    payload.id = generatedFacultyId;
    payload.user = createUser._id; // reference created user _id
    payload.academicFaculty = isExistAcademicDepartment.academicFaculty; // set academicFaculty

    // create faculty into DB with transaction-2
    const [createFaculty] = await Faculty.create([payload], { session });

    // commit transaction
    await session.commitTransaction();
    return createFaculty;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    throw new Error(error);
  } finally {
    await session.endSession();
  }
};

// create admin
const createAdminIntoDB = async (
  imageInfo: TMulterFile | undefined,
  password: string,
  payload: TFaculty,
) => {
  // check email is already use
  const isExistsUser = await User.findOne({ email: payload.email });
  if (isExistsUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      'The user email is already exists.',
    );
  }

  // create a user object
  const userData: Partial<TUser> = {
    role: 'admin',
    email: payload.email,
    password: password || (config.default_password as string),
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //include generated id in userData
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    if (imageInfo) {
      // upload image in cloudinary
      const imgPublicId = `${newUser[0].id}${payload.name.lastName}`;
      const profileImg = await upLoadImageInCloudinary(
        imageInfo.path,
        imgPublicId,
      );
      // set image url
      payload.profileImg = profileImg.secure_url;
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// get specific user data
const getMe = async (userId: string, userRole: string) => {
  let result = null;

  switch (userRole) {
    case 'admin':
      result = await Admin.findOne({ id: userId }).populate('user');
      break;
    case 'faculty':
      result = await Faculty.findOne({ id: userId }).populate('user');
      break;
    case 'student':
      result = await Student.findOne({ id: userId }).populate('user');
      break;
    default:
      break;
  }

  return result;
};

// change user status
const changeUserStatus = async (id: string, updatedStatus: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    {
      status: updatedStatus,
    },
    { new: true },
  );
  return result;
};

export const userServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeUserStatus,
};
