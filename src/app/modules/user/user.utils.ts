import { TAcademicSemester } from '../academicSemester/academicSemester.intreface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    { role: 'student' },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent?.id : undefined;
};

// --> year -> semesterCode -> 4 digit number --->(2025010001)
export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString();

  const lastAdmitStudentId = await findLastStudentId();
  const lastAdmitStudentSemesterCode = lastAdmitStudentId?.substring(4, 6);
  const lastAdmitStudentYear = lastAdmitStudentId?.substring(0, 4);

  const currentStudentSemesterCode = payload.code;
  const currentStudentYear = payload.year;

  if (lastAdmitStudentId && lastAdmitStudentSemesterCode === currentStudentSemesterCode && lastAdmitStudentYear === currentStudentYear) {
    currentId = lastAdmitStudentId.substring(6);
  }


  let incrementStudentId = (Number(currentId) + 1)
    .toString()
    .padStart(4, '0');
  incrementStudentId = `${payload.year}${payload.code}${incrementStudentId}`;

  return incrementStudentId;
};
