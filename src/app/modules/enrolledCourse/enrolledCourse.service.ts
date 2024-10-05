import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offerd course/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { EnrolledCourse } from './enrolledCourse.model';
import { Student } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';

const createEnrolledCourseIntoDB = async (
  studentId: string,
  payload: TEnrolledCourse,
) => {
  const { offeredCourse } = payload;
  // check exist offered course
  const isExistsOfferedCourse = await OfferedCourse.findById(offeredCourse);
  if (!isExistsOfferedCourse) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'The offered course is not found!',
    );
  }
  const {
    semesterRegistration,
    maxCapacity,
    academicDepartment,
    academicFaculty,
    academicSemester,
    faculty,
    course,
  } = isExistsOfferedCourse;

  // check course capacity is available
  if (maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Room is full.');
  }

  // got _id from student and check exist student
  const isExistStudent = await Student.findOne({ id: studentId }, { _id: 1 });
  const { _id: student_id } = isExistStudent!; // (!) use non null assertion operator
  if (!student_id) {
    throw new AppError(httpStatus.NOT_FOUND, 'The student is not found.');
  }

  // check already enrolled the student in this course
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    offeredCourse,
    semesterRegistration,
    student: student_id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      httpStatus.CONFLICT,
      'The student is already enrolled in this course',
    );
  }

  // total enrolled credits + new enrolled course > maxCredit
  const studentEnrolledCourseCredits = await EnrolledCourse.aggregate([
    // stage 1
    {
      $match: { student: student_id, semesterRegistration },
    },
    // stage 2
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'courseData',
      },
    },
    // stage 3
    {
      $unwind: '$courseData',
    },
    // stage 4
    {
      $group: {
        _id: null,
        totalEnrolledCredit: { $sum: '$courseData.credits' },
      },
    },
    // stage 5
    {
      $project: { _id: 0 },
    },
  ]);

  // enrolled course credits sum
  const enrolledCreditsCoursesSum = studentEnrolledCourseCredits.length
    ? studentEnrolledCourseCredits[0].totalEnrolledCredit
    : 0;

  const getSemesterRegistration =
    await SemesterRegistration.findById(semesterRegistration).select(
      'maxCredit',
    );
  // semester maxCredit
  const maxCreditFromSemesterRegistration = getSemesterRegistration!.maxCredit;

  // student want enrolled the course credit
  const currentCourse = await Course.findById(course).select('credits');
  const currentCourseCredits = currentCourse!.credits;

  const totalCreditWithCurrentAndEnrolledCourse =
    enrolledCreditsCoursesSum + currentCourseCredits;

  // check the student credits is available for this semester
  if (
    !(
      maxCreditFromSemesterRegistration >=
      totalCreditWithCurrentAndEnrolledCourse
    )
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have not enough credits for enrolled this course',
    );
  }

  // crate session
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();

    // create enrolled course
    const enrolledCourseData = {
      academicDepartment,
      academicFaculty,
      academicSemester,
      course,
      faculty,
      offeredCourse,
      semesterRegistration,
      student: student_id,
    };
    const [result] = await EnrolledCourse.create([enrolledCourseData], {
      session,
    });
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "Can't enrolled course.");
    }

    await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      { $inc: { maxCapacity: -1 } },
      { session },
    );

    // commit session
    await session.commitTransaction();
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    throw new Error(error?.message);
  } finally {
    await session.endSession();
  }
};

export const enrolledCourseService = {
  createEnrolledCourseIntoDB,
};
