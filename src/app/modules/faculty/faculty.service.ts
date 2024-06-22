import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TFaculty } from './faculty.interface';
import Faculty from './faculty.model';
import { User } from '../user/user.model';

const getAllFacultyFromDB = async (query: Record<string, unknown>) => {
  const searchableField = ['name.lastName', 'email', 'presentAddress'];

  const facultyQuery = new QueryBuilder(Faculty.find().populate('user'), query)
    .filter()
    .search(searchableField)
    .paginate()
    .fields()
    .sort();

  const result = facultyQuery.modelQuery;
  return result;
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findById(id).populate('user');
  return result;
};

const updateSpecificFacultyByIdFromDB = async (
  payload: Partial<TFaculty>,
  id: string,
) => {
  const { name, ...remaining } = payload;

  const modifiedUpdatedFaculty: Record<string, unknown> = { ...remaining };

  if (name && Object.keys(name)) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedFaculty[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findByIdAndUpdate(id, modifiedUpdatedFaculty, {
    new: true,
  });

  return result;
};

const deleteSpecificFacultyByIdFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // soft delete faculty with transaction-1
    const facultyDeleted = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!facultyDeleted) {
      throw new Error('Failed to delete faculty');
    }

    // soft delete users with transaction-2
    const userDeleted = await User.findByIdAndUpdate(
      facultyDeleted.user,
      { isDeleted: true },
      { new: true, session },
    );
    if (!userDeleted) {
      throw new Error('Failed to delete faculty');
    }

    // commit transaction
    await session.commitTransaction();
    return facultyDeleted;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    throw new Error(error);
  } finally {
    await session.endSession();
  }
};

export const facultyServices = {
  getAllFacultyFromDB,
  getSingleFacultyFromDB,
  deleteSpecificFacultyByIdFromDB,
  updateSpecificFacultyByIdFromDB,
};
