import { userServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { RequestHandler } from 'express';

const safeHandler: RequestHandler = async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await userServices.createStudentIntoDB(password, studentData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Student created successfully',
    data: result,
  });
};

const createStudent = catchAsync(safeHandler);

export const userControllers = {
  createStudent,
};
