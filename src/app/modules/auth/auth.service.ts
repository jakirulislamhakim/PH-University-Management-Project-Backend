import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TChangePassword, TLoginUser } from './auth.interfacce';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createJwtToken } from './auth.utils';
import {
  decodedRefreshToken,
  decodedResetPassToken,
} from '../../utils/decodedToken';
import { sendEmail } from '../../utils/sendEmail';

const throwAppError = (httpStatus: number, message: string): Error => {
  throw new AppError(httpStatus, message);
};

const loginUser = async (payload: TLoginUser) => {
  const { id, password } = payload;

  // check the user exists
  const isExistsUser = await User.isUserExistsByCustomId(id);
  if (!isExistsUser) {
    throwAppError(httpStatus.NOT_FOUND, 'The user is not found !');
  }
  // if password not exists
  if (!isExistsUser?.password) {
    throw new Error('Unauthorized users');
  }

  //check the user is deleted
  const isDeleted = isExistsUser?.isDeleted;
  if (isDeleted) {
    throwAppError(httpStatus.BAD_REQUEST, 'The users is deleted');
  }

  //check the user is blocked
  const userStatus = isExistsUser?.status;
  if (userStatus === 'blocked') {
    throwAppError(httpStatus.BAD_REQUEST, 'The users is ' + userStatus);
  }

  // checking password match
  const matchPassword = await User.isPasswordMatch(
    password,
    isExistsUser?.password,
  );
  if (!matchPassword) {
    throwAppError(httpStatus.FORBIDDEN, 'Password do not match');
  }

  // create jwt token and sent to the client
  const payloadForJwt = {
    userId: isExistsUser.id,
    userRole: isExistsUser.role,
  };

  // sign jwt access token
  const accessToken = createJwtToken(
    payloadForJwt,
    config.jwt_access_secret_key as string,
    config.jwt_access_exp_time as string,
  );
  // sign jwt refresh token
  const refreshToken = createJwtToken(
    payloadForJwt,
    config.jwt_refresh_secret_key as string,
    config.jwt_refresh_exp_time as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: isExistsUser.needsPasswordChange,
  };
};

const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: TChangePassword,
) => {
  const { userId, userRole: role } = userData;
  const { oldPassword, newPassword } = payload;

  // find user
  const user = await User.isUserExistsByCustomId(userId);
  if (!user) {
    return throwAppError(httpStatus.NOT_FOUND, 'user not found');
  }

  //check the user is deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    return throwAppError(httpStatus.BAD_REQUEST, 'The users is deleted');
  }

  //check the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    return throwAppError(httpStatus.BAD_REQUEST, 'The users is ' + userStatus);
  }

  // check user given old password matched
  const matchPassword = await User.isPasswordMatch(
    oldPassword,
    user?.password as string,
  );
  if (!matchPassword) {
    return throwAppError(httpStatus.BAD_REQUEST, 'Password do not match !');
  }

  // hash new password
  const newHashPassword = await bcrypt.hash(
    newPassword,
    Number(config.salt_Rounds) as number,
  );

  // update password into DB
  await User.findOneAndUpdate(
    {
      id: userId,
      role,
    },
    {
      needsPasswordChange: false,
      password: newHashPassword,
      passwordChangeAt: new Date(),
    },
  );
  return null;
};

const refreshToken = async (token: string) => {
  const decoded = decodedRefreshToken(token);

  const { userId, userRole, iat } = decoded;

  // find user
  const user = await User.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  //check the user is deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'The users is deleted');
  }

  //check the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.BAD_REQUEST, `The ${userRole} ` + userStatus);
  }

  // check password change time after jwt issued time
  if (
    user.passwordChangeAt &&
    User.isJwtIssuedAtAfterPasswordChangeAt(
      user?.passwordChangeAt,
      iat as number,
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized!');
  }

  // create jwt token and sent to the client
  const payloadForJwt = {
    userId: user.id,
    userRole: user.role,
  };

  // sign jwt access token
  const accessToken = createJwtToken(
    payloadForJwt,
    config.jwt_access_secret_key as string,
    config.jwt_access_exp_time as string,
  );

  return { accessToken };
};

const forgetPassword = async (userId: string) => {
  const user = await User.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  //check the user is deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'The users is deleted');
  }

  //check the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'The user is blocked.');
  }
  // create jwt token and sent to the client
  const payloadForJwt = {
    userId: user.id,
    userRole: user.role,
  };

  // sign jwt access token
  const resetPassAccessToken = createJwtToken(
    payloadForJwt,
    config.jwt_reset_secret_key as string,
    '10m',
  );

  const resetUiLink = `${config.reset_pass_url}?id=${user.id}&token=${resetPassAccessToken}`;
  // console.log(resetUiLink);

  sendEmail(user.email, resetUiLink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  resetPassToken: string,
) => {
  const user = await User.isUserExistsByCustomId(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  //check the user is deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'The users is deleted');
  }

  //check the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'The user is blocked.');
  }

  // decoded token-> check reset token is valid
  const decoded = decodedResetPassToken(resetPassToken);
  const { userId, userRole } = decoded;
  if (userId !== payload.id) {
    throw new AppError(httpStatus.FORBIDDEN, 'Do not match userId');
  }

  // hash new reset password
  const newHashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.salt_Rounds) as number,
  );

  // update password into DB
  const result = await User.findOneAndUpdate(
    {
      id: userId,
      role: userRole,
    },
    {
      needsPasswordChange: false,
      password: newHashPassword,
      passwordChangeAt: new Date(),
    },
    {
      new: true,
    },
  );

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Password do not reset. Something went wrong',
    );
  }
};

export const authServices = {
  loginUser,
  changePasswordIntoDB,
  refreshToken,
  forgetPassword,
  resetPassword,
};
