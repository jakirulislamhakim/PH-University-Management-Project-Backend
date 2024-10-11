import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { courseSearchableFields } from './course.constant';
import { TCourse, TCourseFaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const CreateCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCourseFromDB = async (query: Record<string, unknown>) => {
  // const result = await Course.find();

  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .paginate()
    .fields()
    .sort();

  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const deleteSpecificCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const updateSpecificCourseIntoDB = async (
  id: string,
  payload: Partial<TCourse>,
) => {
  const { preRequisiteCourses, ...remainingCourseData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updateBasicCourseField = await Course.findByIdAndUpdate(
      id,
      remainingCourseData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updateBasicCourseField) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }

    // check if there is any perquisite courses to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted fields
      const deletedRequisite = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((course) => course.course);
      // remove course obj
      const deletePreRequisiteCourse = await Course.findByIdAndUpdate(
        id,
        {
          $pull: { preRequisiteCourses: { course: { $in: deletedRequisite } } },
        },
        { runValidators: true, new: true, session },
      );

      if (!deletePreRequisiteCourse) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }

      // filter out new add data
      const newPerquisitesCourse = preRequisiteCourses.filter(
        (el) => el.course && !el.isDeleted,
      );
      // add new course obj
      const addPerquisitesCourse = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPerquisitesCourse } },
        },
        { new: true, runValidators: true, session },
      );

      if (!addPerquisitesCourse) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }
    }

    await session.commitTransaction();

    const result = await Course.findById(id);
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  } finally {
    await session.endSession();
  }
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: TCourseFaculty,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const getFacultiesWithCourseFromDB = async (course_Id: string) => {
  const result = await CourseFaculty.findOne({ course: course_Id }).populate(
    'faculties',
    'name designation',
  );

  return result;
};

const removeFacultiesWithCourseFromDB = async (
  id: string,
  payload: TCourseFaculty,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

export const courseServices = {
  CreateCourseIntoDB,
  getAllCourseFromDB,
  getSingleCourseFromDB,
  deleteSpecificCourseFromDB,
  updateSpecificCourseIntoDB,
  assignFacultiesWithCourseIntoDB,
  getFacultiesWithCourseFromDB,
  removeFacultiesWithCourseFromDB,
};
