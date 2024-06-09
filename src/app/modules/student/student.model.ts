import { CallbackError, Schema, model } from 'mongoose';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: true,
  },
  fatherOccupation: {
    type: String,
    required: true,
  },
  fatherContactNo: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  motherOccupation: {
    type: String,
    required: true,
  },
  motherContactNo: {
    type: String,
    required: true,
  },
});

const localGuradianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const studentSchema = new Schema<TStudent>(
  {
    id: { type: String, required: [true, 'id is required'], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user id is required'],
      unique: true,
      ref: 'User',
    },
    name: { type: userNameSchema, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    dateOfBirth: { type: String },
    email: { type: String, required: true, unique: true },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloogGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: { type: String, required: true },
    permanentAddres: { type: String, required: true },
    guardian: guardianSchema,
    localGuardian: localGuradianSchema,
    profileImg: { type: String },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment'
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Middleware to check if the student exists before deleting
studentSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const isExistStudent = await Student.findOne(this.getQuery());
    if (!isExistStudent) {
      return next(new AppError(httpStatus.FORBIDDEN, "This student doesn't exist"));
    }
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

export const Student = model<TStudent>('Student', studentSchema);
