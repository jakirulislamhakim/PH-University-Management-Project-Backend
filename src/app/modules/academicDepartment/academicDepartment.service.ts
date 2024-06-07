import { TAcademicDepartment } from './academicDepartment.interface';
import AcademicDepartment from './academicDepartment.model';

// create a academicDepartment
const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};
// get all academicDepartment
const getAllAcademicFacultiesFromDB = async () => {
  const result = await AcademicDepartment.find();
  return result;
};
// get single academicDepartment
const getSingleAcademicDepartmentFromDB = async (_id: string) => {
  const result = await AcademicDepartment.findById({ _id });
  return result;
};

// update a academicDepartment
const updateAllAcademicDepartmentIntoDB = async (
  _id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findByIdAndUpdate(_id, payload, {
    new: true,
  });
  return result;
};

export const academicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicFacultiesFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAllAcademicDepartmentIntoDB,
};
