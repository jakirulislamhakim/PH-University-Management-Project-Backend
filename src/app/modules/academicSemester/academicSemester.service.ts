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

// get all semester from DB
const getAllAcademicSemesterFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};

// get single semester from DB
const getSingleAcademicSemesterFromDB = async (_id: string) => {
  const result = await AcademicSemester.findById({ _id });
  return result;
};

// update a specific semester data
const updateAllAcademicSemesterFromDB = async (
  _id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (academicSemesterNameCodeMapper[payload.name as string] !== payload.code) {
    throw new Error('Invalid semester code !');
  }

  const result = await AcademicSemester.findByIdAndUpdate(_id, payload, {
    new: true,
  });
  return result;
};

export const academicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFromDB,
  updateAllAcademicSemesterFromDB,
};
