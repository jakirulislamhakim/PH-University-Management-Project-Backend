import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const { refreshToken, ...data } = await authServices.loginUser(req.body);

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    data,
    statusCode: httpStatus.OK,
    message: 'Successfully login user.',
  });
});

const changePassword = catchAsync(async (req, res) => {
  const passwordData = req.body;
  const data = await authServices.changePasswordIntoDB(req?.user, passwordData);

  sendResponse(res, {
    data,
    statusCode: httpStatus.OK,
    message: 'Successfully updated password.',
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const data = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    data,
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved refresh token.',
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const userId = req.body.id;
  const data = await authServices.forgetPassword(userId);
  sendResponse(res, {
    data,
    statusCode: httpStatus.OK,
    message: 'Successfully generated reset link . Please check your email',
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const resetPassToken = req.headers.authorization;
  const data = await authServices.resetPassword(
    req.body,
    resetPassToken as string,
  );
  sendResponse(res, {
    data,
    statusCode: httpStatus.OK,
    message: 'Successfully reset your password',
  });
});

export const authControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
