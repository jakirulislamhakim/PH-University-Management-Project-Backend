import { z } from 'zod';

const createPreRequisiteCourseValidationSchema = z.object({
  course: z.string({
    required_error: 'Course  is required',
    invalid_type_error: 'Course must be a string',
  }),
  isDeleted: z.boolean().optional().default(false),
});

export const createCourseValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Course title is required',
        invalid_type_error: 'Title must be a string',
      })
      .max(50, "Title can't be over 30 characters."),
    prefix: z.string({
      required_error: 'Prefix is required',
      invalid_type_error: 'Prefix must be a string',
    }),
    code: z.number({
      required_error: 'Code is required',
      invalid_type_error: 'Code must be a number',
    }),
    credits: z.number({
      required_error: 'Credits are required',
      invalid_type_error: 'Credits must be a number',
    }),
    preRequisiteCourses: z
      .array(createPreRequisiteCourseValidationSchema)
      .optional(),
  }),
});

export const courseValidation = {
  createCourseValidationSchema,
};
