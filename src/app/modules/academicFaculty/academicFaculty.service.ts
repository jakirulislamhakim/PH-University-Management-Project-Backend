import { TAcademicFaculty } from './academicFaculty.interface';
import AcademicFaculty from './academicFaculty.model';

// create a  academicFaculty
const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};
// get all academicFaculty
const getAllAcademicFacultiesFromDB = async () => {
  const result = await AcademicFaculty.find();
  return result;
};
// get single academicFaculty
const getSingleAcademicFacultyFromDB = async (_id: string) => {
  const result = await AcademicFaculty.findById({ _id });
  return result;
};

// update a academicFaculty
const updateAllAcademicFacultyIntoDB = async (
  _id: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFaculty.findByIdAndUpdate(_id, payload, {
    new: true,
  });
  return result;
};

export const academicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultiesFromDB,
  getSingleAcademicFacultyFromDB,
  updateAllAcademicFacultyFromDB: updateAllAcademicFacultyIntoDB,
};
