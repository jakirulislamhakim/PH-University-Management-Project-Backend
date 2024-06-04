import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.intreface';
import { AcademicSemesterSchemaCode, AcademicSemesterSchemaName, Months } from './academicSemester.const';



const academicSemesterSchema = new Schema<TAcademicSemester>(
    {
        name: {
            type: String,
            enum: AcademicSemesterSchemaName,
            required: true,
        },
        code: {
            type: String,
            enum: AcademicSemesterSchemaCode,
            required: true,
        },
        year: {
            type: Date,
            required: true,
        },
        startMonth: {
            type: String,
            enum: Months,
            required: true,
        },
        endMonth: {
            type: String,
            enum: Months,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const AcademicSemester = model<TAcademicSemester>(
    'AcademicSemester',
    academicSemesterSchema,
);
