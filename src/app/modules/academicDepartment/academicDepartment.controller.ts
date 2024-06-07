import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicDepartmentServices } from './academicDepartment.service';

// create a academicDepartment
const createAcademicDepartment = catchAsync(async (req, res) => {
  const academicDepartmentData = req.body;

  const result =
    await academicDepartmentServices.createAcademicDepartmentIntoDB(
      academicDepartmentData,
    );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Academic Department successfully created .',
    data: result,
  });
});

// get all academicDepartment
const getAllAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentServices.getAllAcademicFacultiesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Successfully Retrieved all academic Department',
    data: result,
  });
});

// get single academicDepartment
const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { academicDepartmentId } = req.params;
  const result =
    await academicDepartmentServices.getSingleAcademicDepartmentFromDB(
      academicDepartmentId,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Successfully Retrieved single academic department',
    data: result,
  });
});

// update a academicDepartment
const updateAllAcademicDepartment = catchAsync(async (req, res) => {
  const { academicDepartmentId } = req.params;
  const result =
    await academicDepartmentServices.updateAllAcademicDepartmentIntoDB(
      academicDepartmentId,
      req.body,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Successfully updated academic department',
    data: result,
  });
});

export const academicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAllAcademicDepartment,
};
