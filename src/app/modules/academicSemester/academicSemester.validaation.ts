import { z } from 'zod';
import {
  AcademicSemesterSchemaCode,
  AcademicSemesterSchemaName,
  Months,
} from './academicSemester.const';

const createAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...AcademicSemesterSchemaName] as [string, ...string[]]),
    code: z.enum([...AcademicSemesterSchemaCode] as [string, ...string[]]),
    year: z.string().max(4),
    startMonth: z.enum([...Months] as [string, ...string[]]),
  }),
});

const updateAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z
      .enum([...AcademicSemesterSchemaName] as [string, ...string[]])
      .optional(),
    code: z
      .enum([...AcademicSemesterSchemaCode] as [string, ...string[]])
      .optional(),
    year: z.string().min(4).max(4).optional(),
    startMonth: z.enum([...Months] as [string, ...string[]]).optional(),
  }),
});

export const academicSemesterValidations = {
  createAcademicSemesterValidationSchema,
  updateAcademicSemesterValidationSchema,
};
