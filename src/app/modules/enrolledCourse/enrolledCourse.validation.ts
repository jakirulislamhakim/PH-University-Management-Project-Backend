import { z } from 'zod';

// Schema for creating an enrolled course
const createEnrolledCourseValidationZodSchema = z.object({
  body: z.object({
    offeredCourse: z.string({
      required_error: 'Offered course is required',
    }),
  }),
});

// Common schema for course marks
const enrolledCourseMarksSchema = z.object({
  classTest1: z.number().max(10).optional(),
  midTerm: z.number().max(30).optional(),
  classTest2: z.number().max(10).optional(),
  finalTerm: z.number().max(50).optional(),
});

// Schema for updating course marks
const updateEnrolledCourseMarksValidationZodSchema = z.object({
  body: z.object({
    semesterRegistration: z.string({
      required_error: 'Semester registration is required',
    }),
    offeredCourse: z.string({
      required_error: 'Offered course is required',
    }),
    student: z.string({ required_error: 'Student ID is required' }),
    courseMarks: enrolledCourseMarksSchema,
  }),
});

// Export validations as an object
export const enrolledCourseValidations = {
  createEnrolledCourseValidationZodSchema,
  updateEnrolledCourseMarksValidationZodSchema,
};
