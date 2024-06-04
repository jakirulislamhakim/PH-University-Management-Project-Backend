import { z } from "zod";
import { AcademicSemesterSchemaCode, AcademicSemesterSchemaName, Months } from "./academicSemester.const";

const createAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum([...AcademicSemesterSchemaName] as [string, ...string[]]),
        code: z.enum([...AcademicSemesterSchemaCode] as [string, ...string[]]),
        year: z.date(),
        startMonth: z.enum([...Months] as [string, ...string[]])
    })
})


export const academicSemesterValidations = {
    academicSemesterValidationSchema: createAcademicSemesterValidationSchema
}