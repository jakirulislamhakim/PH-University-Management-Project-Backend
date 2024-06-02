import z from 'zod';

export const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'password must be string',
    })
    .min(0, { message: 'password must be required' })
    .max(20, { message: "password can't not be upper 20 character" })
    .optional(),
});
