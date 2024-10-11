import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import AcademicFaculty from '../academicFaculty/academicFaculty.model';
import AcademicDepartment from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import Faculty from '../faculty/faculty.model';
import { hasTimeConflict } from './offeredCourse.utiles';
import { RegistrationStatus } from '../semesterRegistration/semesterRegistration.const';
import { Student } from '../student/student.model';
import { EnrolledCourse } from '../enrolledCourse/enrolledCourse.model';

// create offered course
const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;
  // check exists semesterRegistration
  const isExistsSemesterRegistration =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isExistsSemesterRegistration) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration is not found!',
    );
  }
  // set academicSemester object id from semester registration
  const academicSemester = isExistsSemesterRegistration.academicSemester;

  // check exists academicFaculty
  const isExistsAcademicFaculty =
    await AcademicFaculty.findById(academicFaculty);
  if (!isExistsAcademicFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty is not found!');
  }

  // check exists academicDepartment
  const isExistsAcademicDepartment =
    await AcademicDepartment.findById(academicDepartment);
  if (!isExistsAcademicDepartment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department is not found!',
    );
  }

  // check exists course
  const isExistsCourse = await Course.findById(course);
  if (!isExistsCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course is not found!');
  }

  // check exists course
  const isExistsFaculty = await Faculty.findById(faculty);
  if (!isExistsFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found!');
  }

  // check if the department is belong to the faculty
  const isDepartmentBelongToTheFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });
  if (!isDepartmentBelongToTheFaculty) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This ${isExistsAcademicDepartment.name} is not belong to the ${isExistsAcademicFaculty.name}`,
    );
  }

  // check if the same offered course same section in same registered semester exists
  const isOfferedCourseExistsWithSemesterRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      section,
      course,
    });

  if (isOfferedCourseExistsWithSemesterRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Offered course with same section is already exists!',
    );
  }

  // get the schedule of the faculties
  const existingAssignSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('startTime endTime days -_id');

  const newSchedule = {
    startTime,
    endTime,
    days,
  };

  // check time conflict for the faculty
  const timeConflictForFaculty = hasTimeConflict(
    existingAssignSchedule,
    newSchedule,
  );
  if (timeConflictForFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This faculty is not available at that time | choose other time or day',
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
  return null;
};

// get all course data
const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .sort()
    .paginate();

  const meta = await offeredCourseQuery.countTotal();

  const courses = await offeredCourseQuery.modelQuery;
  return {
    courses,
    meta,
  };
};

// get all my offered course data for student
const getMyOfferedCourseForStudentFromDB = async (
  studentId: string,
  query: Record<string, string>,
) => {
  const student = await Student.findOne({ id: studentId });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'The student is not found ');
  }

  // current ongoing semester
  const currentOngoingSemesterRegistration = await SemesterRegistration.findOne(
    {
      status: 'ONGOING',
    },
  );

  if (!currentOngoingSemesterRegistration) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'There is no semester currently ongoing ',
    );
  }

  // pagination query
  const page = parseInt(query?.page) || 1;
  const limit = parseInt(query?.limit) || 0;
  const skip = (page - 1) * limit;

  const paginationQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];

  const aggregationQuery = [
    {
      $match: {
        semesterRegistration: currentOngoingSemesterRegistration._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingSemesterRegistration:
            currentOngoingSemesterRegistration._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOngoingSemesterRegistration',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledMyCourses',
      },
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: '$completedCourses',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisiteFulfill: {
          $or: [
            { $eq: ['$course.preRequisiteCourses', []] },
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course',
                '$completedCourseIds',
              ],
            },
          ],
        },
        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledMyCourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisiteFulfill: true,
      },
    },
    {
      $project: { completedCourses: 0, enrolledMyCourses: 0 },
    },
  ];

  const result = await OfferedCourse.aggregate([
    ...aggregationQuery,
    ...paginationQuery,
  ]);

  // pagination

  const total = (await OfferedCourse.aggregate(aggregationQuery)).length;
  const totalPage = Math.ceil(total / limit);

  const meta = {
    page,
    limit,
    total,
    totalPage,
  };

  return {
    meta,
    myOfferedCourse: result,
  };
};

// get single course data by object id
const getMyEnrolledCourseForStudentFromDB = async (
  studentId: string,
  query: Record<string, string>,
) => {
  const student = await Student.findOne({ id: studentId });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'The student is not found');
  }

  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: student._id }).populate(
      'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
    ),
    query,
  );

  const result = await enrolledCourseQuery.modelQuery;

  return result;
};

// get single course data by object id
const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This offered course is not found !',
    );
  }
  return result;
};

// update specific offered course data by object id
const updateSpecificOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<
    TOfferedCourse,
    'days' | 'startTime' | 'endTime' | 'faculty' | 'maxCapacity'
  >,
) => {
  const { faculty, days, endTime, startTime } = payload;

  // check exists  request for update offered course
  const isExistsOfferedCourse = await OfferedCourse.findById(id); //.select('faculty days endTime startTime maxCapacity');
  if (!isExistsOfferedCourse) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This offered course is not found !',
    );
  }

  // check is faculty exists
  const isExistsFaculty = await Faculty.findById(faculty);
  if (!isExistsFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'The faculty is not found!');
  }

  // get semester registration objectid from offered course
  const semesterRegistration = isExistsOfferedCourse.semesterRegistration;
  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration).select('status');

  if (semesterRegistrationStatus?.status !== RegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `you can't update the semester is when ${semesterRegistrationStatus?.status} !`,
    );
  }

  // get the schedule of the faculties
  const existingAssignSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('startTime endTime days -_id');

  const newSchedule = {
    startTime,
    endTime,
    days,
  };

  // check time conflict for the faculty
  const timeConflictForFaculty = hasTimeConflict(
    existingAssignSchedule,
    newSchedule,
  );
  if (timeConflictForFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This faculty is not available at that time | choose other time or day',
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  getMyOfferedCourseForStudentFromDB,
  getMyEnrolledCourseForStudentFromDB,
  getSingleOfferedCourseFromDB,
  updateSpecificOfferedCourseIntoDB,
};
