import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { courseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const courseData = req.body;
  const data = await courseServices.CreateCourseIntoDB(courseData);

  sendResponse(res, {
    data,
    statusCode: httpStatus.CREATED,
    message: 'Successfully created course',
  });
});

const getAllCourse = catchAsync(async (req, res) => {
  const data = await courseServices.getAllCourseFromDB(req.query);

  sendResponse(res, {
    data,
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved course',
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await courseServices.getSingleCourseFromDB(id);

  sendResponse(res, {
    data,
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved a course',
  });
});

const deleteSpecificCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await courseServices.deleteSpecificCourseFromDB(id);

  sendResponse(res, {
    data,
    statusCode: httpStatus.OK,
    message: 'Successfully deleted course',
  });
});

export const courseControllers = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  deleteSpecificCourse,
};
