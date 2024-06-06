import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicFacultyServices } from './academicFaculty.service';

// create a academicFaculty
const createAcademicFaculty = catchAsync(async (req, res) => {
  const academicFacultyData = req.body;

  const result =
    await academicFacultyServices.createAcademicFacultyIntoDB(
      academicFacultyData,
    );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Academic Faculty successfully created .',
    data: result,
  });
});

// get all academicFaculty
const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await academicFacultyServices.getAllAcademicFacultiesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Successfully Retrieved all academic faculty',
    data: result,
  });
});

// get single academicFaculty
const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { academicFacultyId } = req.params;
  const result =
    await academicFacultyServices.getSingleAcademicFacultyFromDB(
      academicFacultyId,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Successfully Retrieved single academic faculty',
    data: result,
  });
});

// update a academicFaculty
const updateAllAcademicFaculty = catchAsync(async (req, res) => {
  const { academicFacultyId } = req.params;
  const result = await academicFacultyServices.updateAllAcademicFacultyFromDB(
    academicFacultyId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Successfully updated academic faculty',
    data: result,
  });
});

export const academicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAllAcademicFaculty,
};
