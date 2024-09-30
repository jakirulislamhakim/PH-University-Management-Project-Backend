import { userServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await userServices.createStudentIntoDB(password, studentData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Student created successfully',
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await userServices.createFacultyIntoDB(password, facultyData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Faculty created successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await userServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Admin is created succesfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId, userRole } = req.user;
  const result = await userServices.getMe(userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Successfully retrieve the user',
    data: result,
  });
});

const changeUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const data = await userServices.changeUserStatus(id, status);

  sendResponse(res, {
    data,
    statusCode: httpStatus.OK,
    message: `The user is now ${status}`,
  });
});

export const userControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeUserStatus,
};
