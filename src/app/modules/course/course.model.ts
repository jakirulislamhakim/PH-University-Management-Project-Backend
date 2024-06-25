import mongoose, { Schema } from 'mongoose';
import { TCourse, TPreRequisiteCourse } from './course.interface';

// Define the TPreRequisiteCourse schema
const preRequisiteCourseSchema = new mongoose.Schema<TPreRequisiteCourse>({
  course: {
    type: Schema.Types.ObjectId,
    required: [true, 'Course reference is required'],
    ref: 'Course',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

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

// Create and export the Course model
export const Course = mongoose.model('Course', courseSchema);
