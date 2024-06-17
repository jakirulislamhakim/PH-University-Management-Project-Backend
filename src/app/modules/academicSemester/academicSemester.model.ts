import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.intreface';
import {
  AcademicSemesterSchemaCode,
  AcademicSemesterSchemaName,
  Months,
} from './academicSemester.const';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: AcademicSemesterSchemaName,
      required: true,
    },
    code: {
      type: String,
      enum: AcademicSemesterSchemaCode,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      enum: Months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Months,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

academicSemesterSchema.pre('save', async function (next) {
  const isExistSemester = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });
  if (isExistSemester) {
    throw new AppError(httpStatus.FORBIDDEN, 'Semester is already exist !');
  }
  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
