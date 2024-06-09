import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async () => {
  const result = await Student.find().populate('admissionSemester').populate(
    {
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' }
    });
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id }).populate('admissionSemester').populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty'
    }
  });
  return result;
};

const deleteSpecificStudentByIdIntoDB = async (id: string) => {

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // delete student (transaction -1)
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    ).populate('user')

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student")
    }

    // delete user (transaction -2)
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user')
    }

    await session.commitTransaction();
    await session.endSession()

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student")
  }

};

const updateStudentByIdIntoDB = async (id: string, payload: Partial<TStudent>) => {

  // const { localGuardian, name, guardian, ...remaining } = payload;

  // const updateStudent = await Student.updateOne({ id },)

};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteSpecificStudentByIdIntoDB,
  updateStudentByIdIntoDB
};
