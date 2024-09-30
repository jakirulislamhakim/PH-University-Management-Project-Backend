import z from 'zod';
import { UserStatus } from './user.constant';

const changeUserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(UserStatus),
  }),
});

export const userValidation = {
  changeUserStatusValidationSchema,
};
