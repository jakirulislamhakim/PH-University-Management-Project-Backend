import jwt from 'jsonwebtoken';
import { TJwtPayload } from './auth.interfacce';

export const createJwtToken = (
  jwtPayload: TJwtPayload,
  jwtSecretKey: string,
  jwtExpTime: string,
) => {
  return jwt.sign(jwtPayload, jwtSecretKey, {
    expiresIn: jwtExpTime,
  });
};
