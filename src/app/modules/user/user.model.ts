import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { UserStatus } from './user.constant';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangeAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, Number(config.salt_Rounds));
  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// create static methods
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};

// check password match
userSchema.statics.isPasswordMatch = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

// check the jwt token create before the changePasswordAt
userSchema.statics.isJwtIssuedAtAfterPasswordChangeAt = function (
  passwordChangeAt: Date,
  jwtIssuedAt: number,
) {
  const convertSecondPasswordChangeAt =
    new Date(passwordChangeAt).getTime() / 1000;
  return convertSecondPasswordChangeAt > jwtIssuedAt;
};

export const User = model<TUser, UserModel>('User', userSchema);
