import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { offeredCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req, res) => {
  const data = await offeredCourseServices.createOfferedCourseIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Successfully created offered course',
    data,
  });
});

const getAllOfferedCourse = catchAsync(async (req, res) => {
  const data = await offeredCourseServices.getAllOfferedCourseFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved offered course',
    data,
  });
});

const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const data = await offeredCourseServices.getSingleOfferedCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved offered course',
    data,
  });
});

const updateSpecificOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const data = await offeredCourseServices.updateSpecificOfferedCourseIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Successfully updated offered course',
    data,
  });
});

export const offeredCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourse,
  getSingleOfferedCourse,
  updateSpecificOfferedCourse,
};
