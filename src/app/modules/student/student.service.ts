import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

// const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
//   const queryObj = { ...query }; // copy query

//   const searchTerm = query?.searchTerm ? (query?.searchTerm as string) : '';
//   const regex = new RegExp(searchTerm, 'i');

//   const studentSearchableFields: string[] = [
//     'name.firstName',
//     'email',
//     'presentAddress',
//   ];
//   // filtering
//   const excludeQueryProperty: string[] = [
//     'searchTerm',
//     'sort',
//     'limit',
//     'page',
//     'fields',
//   ];
//   // remove prop from copy query obj only stay can email property
//   excludeQueryProperty.forEach((element) => delete queryObj[element]);

//   console.log({ query, queryObj, excludeQueryProperty });

//   const searchQuery = Student.find({
//     $or: studentSearchableFields.map((field) => {
//       return { [field]: { $regex: regex } };
//     }),
//   });

//   const filterQuery = searchQuery
//     .find(queryObj)
//     .populate('admissionSemester')
//     .populate({
//       path: 'academicDepartment',
//       populate: { path: 'academicFaculty' },
//     });

//   const sort = query.sort ? (query.sort as string) : '-createdAt';
//   const sortQuery = filterQuery.sort(sort);

//   const limit = query.limit ? (Number(query.limit) as number) : 1;
//   const limitQuery = sortQuery.limit(limit);

//   const page = query?.page ? Number(query?.page) : 1;
//   const skip = query?.page ? (page - 1) * limit : 0;
//   const paginationQuery = limitQuery.skip(skip);

//   console.log({ page, skip, limit });

//   let fields: string = '-__v';
//   if (query.fields) {
//     fields = (query.fields as string).split(',').join(' ');
//   }
//   console.log(fields);

//   const filedQuery = await paginationQuery.select(fields);

//   return filedQuery;
// };

// refactor student get query

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    Student.find()
      // .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .paginate()
    .sort()
    .fields();

  const result = await studentQuery.modelQuery;
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
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
      { new: true, session },
    ).populate('user');

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    // delete user (transaction -2)
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
  }
};

const updateStudentByIdIntoDB = async (
  id: string,
  payload: Partial<TStudent>,
) => {
  const { name, localGuardian, guardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    // Object.entries() --> gives me a array of key value pair
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  const updateStudent = await Student.findOneAndUpdate(
    { id },
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  );

  return updateStudent;
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteSpecificStudentByIdIntoDB,
  updateStudentByIdIntoDB,
};
