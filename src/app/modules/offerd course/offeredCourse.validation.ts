import { z } from 'zod';
import mongoose from 'mongoose';
import { Days } from './offeredCourse.constant'; // Define the Zod schema for create OfferedCourse

const timeStringValidationSchema = z
  .string()
  .regex(
    new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
    'Invalid time format , expected "HH:MM" in 24 hours format',
  );

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: 'Invalid ObjectId',
        }),
      academicFaculty: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: 'Invalid ObjectId',
        }),
      academicDepartment: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: 'Invalid ObjectId',
        }),
      course: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      }),
      faculty: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: 'Invalid ObjectId',
        }),
      maxCapacity: z.number().int().nonnegative(),
      section: z.number().int().nonnegative(),
      days: z.array(z.enum(Days)),
      startTime: timeStringValidationSchema,
      endTime: timeStringValidationSchema,
    })
    .strict() // extra property doesn't allow,
    .refine(
      (body) => {
        const currentDate = new Date();
        const [startHours, startMinutes] = body.startTime
          .split(':')
          .map((el) => Number(el));
        const [endHours, endMinutes] = body.endTime
          .split(':')
          .map((el) => Number(el));

        const startTime = new Date(currentDate);
        const endTime = new Date(currentDate);

        startTime.setHours(startHours, startMinutes, 0, 0);

        endTime.setHours(endHours, endMinutes, 0, 0);

        return endTime > startTime;
      },
      {
        message: 'Start time should be before end time !',
      },
    ),
});

// Define the Zod schema for update OfferedCourse
const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: 'Invalid ObjectId',
        }),
      maxCapacity: z.number().int().nonnegative(),
      days: z.array(z.enum(Days)),
      startTime: timeStringValidationSchema,
      endTime: timeStringValidationSchema,
    })
    .refine(
      (body) => {
        const currentDate = new Date();
        const [startHours, startMinutes] = body.startTime
          .split(':')
          .map((el) => Number(el));
        const [endHours, endMinutes] = body.endTime
          .split(':')
          .map((el) => Number(el));

        const startTime = new Date(currentDate);
        const endTime = new Date(currentDate);

        startTime.setHours(startHours, startMinutes, 0, 0);

        endTime.setHours(endHours, endMinutes, 0, 0);

        return endTime > startTime;
      },
      {
        message: 'Start time should be before end time !',
      },
    ),
});

export const offeredCourseValidation = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
