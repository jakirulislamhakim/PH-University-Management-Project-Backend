import { CallbackError, Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: { type: String, required: true, unique: true },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// check isExist user before save DB
academicDepartmentSchema.pre('save', async function (next) {
  try {
    const isExistAcademicDepartment = await AcademicDepartment.findOne({
      name: this.name,
    });
    if (isExistAcademicDepartment) {
      throw new AppError(404, 'This academic department is already exist!');
    }
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

//
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const isExistAcademicDepartment = await AcademicDepartment.findOne(
      this.getQuery(),
    );
    if (!isExistAcademicDepartment) {
      throw new AppError(404, 'The department does not exist!');
    }
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
export default AcademicDepartment;
