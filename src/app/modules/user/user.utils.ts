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

  if (
    lastAdmitStudentId &&
    lastAdmitStudentSemesterCode === currentStudentSemesterCode &&
    lastAdmitStudentYear === currentStudentYear
  ) {
    currentId = lastAdmitStudentId.substring(6);
  }

  let incrementStudentId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementStudentId = `${payload.year}${payload.code}${incrementStudentId}`;

  return incrementStudentId;
};

// generated unique faculty id --> F-0001
export const generateFacultyId = async (): Promise<string> => {
  const latestFacultyUser = await User.findOne(
    { role: 'faculty' },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  if (!latestFacultyUser) {
    return 'F-0001';
  }

  const [, currentId] = latestFacultyUser.id.split('-');
  const currentIdNumber = Number(currentId);
  const incrementedIdNumber = (currentIdNumber + 1).toString();
  const paddedIncrementedId = incrementedIdNumber.padStart(4, '0');

  const newFacultyId = `F-${paddedIncrementedId}`;

  return newFacultyId;
};

// generated unique admin id --> A-0001
export const generateAdminId = async (): Promise<string> => {
  const latestFacultyUser = await User.findOne(
    { role: 'admin' },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  if (!latestFacultyUser) {
    return 'A-0001';
  }

  const [, currentId] = latestFacultyUser.id.split('-');
  const currentIdNumber = Number(currentId);
  const incrementedIdNumber = (currentIdNumber + 1).toString();
  const paddedIncrementedId = incrementedIdNumber.padStart(4, '0');

  const newFacultyId = `A-${paddedIncrementedId}`;

  return newFacultyId;
};
