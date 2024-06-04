import { academicSemesterNameCodeMapper } from './academicSemester.const';
import { TAcademicSemester } from './academicSemester.intreface';
import { AcademicSemester } from './academicSemester.model';

// create a semester into DB
const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid semester code!');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

// get all and single(when user give me an id) semester from DB
const getAllAcademicSemesterFromDB = async (_id: string) => {
  if (_id) {
    const result = await AcademicSemester.findById({ _id });
    return result;
  } else {
    const result = await AcademicSemester.find();
    return result;
  }
};

export const academicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
};
