import mongoose, { Schema, model } from 'mongoose';
import { TOfferedCourse } from './offeredCourse.interface';
import { Days } from './offeredCourse.constant';

// Define the Mongoose schema
const OfferedCourseSchema: Schema = new Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SemesterRegistration',
      required: true,
    },
    academicSemester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      required: true,
    },
    academicFaculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
    academicDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    section: {
      type: Number,
      required: true,
    },
    days: {
      type: [String],
      enum: Days,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compile the schema into a model
export const OfferedCourse = model<TOfferedCourse>(
  'OfferedCourse',
  OfferedCourseSchema,
);
