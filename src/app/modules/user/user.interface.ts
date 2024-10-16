/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { UserRole, UserStatus } from './user.constant';

export interface TUser {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangeAt?: Date;
  role: keyof typeof UserRole;
  status: (typeof UserStatus)[number];
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser | null>;
  isPasswordMatch(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
  isJwtIssuedAtAfterPasswordChangeAt(
    passwordChangeAt: Date,
    jwtIssuedAt: number,
  ): boolean;
}

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];

export type TMulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
};
