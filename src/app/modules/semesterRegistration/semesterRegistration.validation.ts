import { z } from 'zod';
import { SemesterRegistrationStatus } from './semesterRegistration.const';

// Define the status type
const statusEnum = z.enum([
  ...(SemesterRegistrationStatus as [string, ...string[]]),
]);

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: statusEnum,
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    minCredit: z.number().int().nonnegative().min(3),
    maxCredit: z.number().int().nonnegative().max(20),
  }),
});

const updateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: statusEnum.optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    minCredit: z.number().int().nonnegative().optional(),
    maxCredit: z.number().int().nonnegative().optional(),
  }),
});

export const semesterRegistrationValidation = {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
};
