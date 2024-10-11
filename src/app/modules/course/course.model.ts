import mongoose, { Query, Schema } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourse,
} from './course.interface';

// Define the TPreRequisiteCourse schema
const preRequisiteCourseSchema = new mongoose.Schema<TPreRequisiteCourse>(
  {
    course: {
      type: Schema.Types.ObjectId,
      required: [true, 'Course reference is required'],
      ref: 'Course',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

// Define the TCourse schema
const courseSchema = new mongoose.Schema<TCourse>(
  {
    title: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    prefix: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: Number,
      required: true,
      trim: true,
    },
    credits: {
      type: Number,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    preRequisiteCourses: [preRequisiteCourseSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
courseSchema.pre<Query<any, any>>(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});
// Create and export the Course model
export const Course = mongoose.model<TCourse>('Course', courseSchema);

// course for faculty schema
const courseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
    unique: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: [true, 'faculties reference id is required'],
    },
  ],
});

export const CourseFaculty = mongoose.model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultySchema,
);
