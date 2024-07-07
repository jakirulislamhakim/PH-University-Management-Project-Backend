import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...roleForAuthorization: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;
    // check if the token given
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized !');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret_key as string,
    ) as JwtPayload;

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
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `The ${userRole} ` + userStatus,
      );
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

    if (
      roleForAuthorization.length &&
      !roleForAuthorization.includes(userRole)
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized');
    }

    //set decoded data as a user and call next function
    req.user = decoded;
    next();
  });
};

export default auth;
