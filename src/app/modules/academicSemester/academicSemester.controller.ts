import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicSemesterServices } from './academicSemester.service';

// create semester controller
const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Academic semester created successfully.',
    data: result,
  });
});

// get all semester controller
const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getAllAcademicSemesterFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Academic seamster's get successfully",
    data: result,
  });
});

// get single semester controller
const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getSingleAcademicSemesterFromDB(
    req.params.semesterId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Academic seamster's get successfully",
    data: result,
  });
});

// update a specific semester
const updateAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const result = await academicSemesterServices.updateAllAcademicSemesterFromDB(
    semesterId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Semester is successfully updated',
    data: result,
  });
});

export const academicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
