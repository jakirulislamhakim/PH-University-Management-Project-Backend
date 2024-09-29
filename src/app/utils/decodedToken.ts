import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

export const decodedAccessToken = (accessToken: string) => {
  try {
    const decoded = jwt.verify(
      accessToken,
      config.jwt_access_secret_key as string,
    ) as JwtPayload;
    return decoded;
  } catch (error) {
    const isTokenExpired = error instanceof jwt.TokenExpiredError;

    throw new AppError(
      httpStatus.UNAUTHORIZED,
      isTokenExpired
        ? 'Access token has expired. Please request a new access token.'
        : 'Invalid token. Please provide valid authentication credentials.',
    );
  }
};

// for decoded refresh token
export const decodedRefreshToken = (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      config.jwt_refresh_secret_key as string,
    ) as JwtPayload;
    return decoded;
  } catch (error) {
    const isTokenExpired = error instanceof jwt.TokenExpiredError;
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      isTokenExpired
        ? 'Refresh token has expired. Please log in again.'
        : 'Invalid token. Please provide valid authentication credentials.',
    );
  }
};

// for decoded refresh token
export const decodedResetPassToken = (resetPassToken: string) => {
  try {
    const decoded = jwt.verify(
      resetPassToken,
      config.jwt_reset_secret_key as string,
    ) as JwtPayload;
    return decoded;
  } catch (error) {
    const isTokenExpired = error instanceof jwt.TokenExpiredError;
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      isTokenExpired
        ? 'Reset  token has expired. Please forget password again !'
        : 'Invalid token. Please provide valid authentication credentials.',
    );
  }
};
