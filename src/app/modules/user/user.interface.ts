/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { UserRole } from './user.constant';

export interface TUser {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangeAt?: Date;
  role: 'student' | 'faculty' | 'admin';
  status: 'blocked' | 'in-progress';
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
