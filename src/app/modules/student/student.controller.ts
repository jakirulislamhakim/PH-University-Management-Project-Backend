import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { RequestHandler } from 'express';

const getAllStudents: RequestHandler = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await StudentServices.getAllStudentsFromDB(query);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Students are retrieved successfully',
    data: result,
  });
});

const getSingleStudent: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentServices.getSingleStudentFromDB(id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Student are retrieved successfully',
    data: result,
  });
});

const deleteSpecificStudentById: RequestHandler = catchAsync(
  async (req, res) => {
    const { id } = req.params;

    const result = await StudentServices.deleteSpecificStudentByIdIntoDB(id);

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Student deleted successfully',
      data: result,
    });
  },
);

const updateStudentById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student: StudentData } = req.body;

  const result = await StudentServices.updateStudentByIdIntoDB(id, StudentData);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Student updated successfully',
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteSpecificStudentById,
  updateStudentById,
};
