import { z } from 'zod';

const createFacultyName = z.object({
  firstName: z.string().min(1, { message: 'First name cannot be empty' }),
  lastName: z.string().min(1, { message: 'Last name cannot be empty' }),
  middleName: z.string().optional(),
});

// main schema
const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().min(1, { message: 'Password is required' }),
    faculty: z.object({
      id: z
        .string()
        .min(1, { message: 'Faculty ID cannot be empty' })
        .optional(),
      user: z
        .string()
        .min(1, { message: 'User ID cannot be empty' })
        .optional(), // ObjectId as a string
      designation: z
        .string()
        .min(1, { message: 'Designation cannot be empty' }),
      name: createFacultyName,
      gender: z.enum(['Male', 'Female', 'Other'], {
        message: 'Gender must be one of: Male, Female, Other',
      }),
      dateOfBirth: z
        .string()
        .min(1, { message: 'Date of birth cannot be empty' }),
      email: z.string().email({ message: 'Invalid email address' }),
      contactNo: z
        .string()
        .min(1, { message: 'Contact number cannot be empty' }),
      emergencyContactNo: z
        .string()
        .min(1, { message: 'Emergency contact number cannot be empty' }),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
        message: 'Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-',
      }),
      presentAddress: z
        .string()
        .min(1, { message: 'Present address cannot be empty' }),
      permanentAddress: z
        .string()
        .min(1, { message: 'Permanent address cannot be empty' }),
      profileImg: z.string().optional(),
      academicDepartment: z
        .string()
        .min(1, { message: 'Academic department cannot be empty' }), // ObjectId as a string
      isDeleted: z.boolean().default(false),
    }),
  }),
});

// Schema for update validation
const updateFacultyValidationSchema = z.object({
  body: z
    .object({
      id: z
        .string()
        .min(1, { message: 'Faculty ID cannot be empty' })
        .optional(),
      user: z
        .string()
        .min(1, { message: 'User ID cannot be empty' })
        .optional(), // ObjectId as a string
      designation: z
        .string()
        .min(1, { message: 'Designation cannot be empty' })
        .optional(),
      name: createFacultyName.partial(),
      gender: z
        .enum(['Male', 'Female', 'Other'], {
          message: 'Gender must be one of: Male, Female, Other',
        })
        .optional(),
      dateOfBirth: z
        .string()
        .min(1, { message: 'Date of birth cannot be empty' })
        .optional(),
      email: z.string().email({ message: 'Invalid email address' }).optional(),
      contactNo: z
        .string()
        .min(1, { message: 'Contact number cannot be empty' })
        .optional(),
      emergencyContactNo: z
        .string()
        .min(1, { message: 'Emergency contact number cannot be empty' })
        .optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
          message:
            'Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-',
        })
        .optional(),
      presentAddress: z
        .string()
        .min(1, { message: 'Present address cannot be empty' })
        .optional(),
      permanentAddress: z
        .string()
        .min(1, { message: 'Permanent address cannot be empty' })
        .optional(),
      profileImg: z.string().optional(),
      academicDepartment: z
        .string()
        .min(1, { message: 'Academic department cannot be empty' })
        .optional(), // ObjectId as a string
      isDeleted: z.boolean().default(false).optional(),
    })
    .partial(), // Makes all properties optional
});

export const facultyValidation = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
