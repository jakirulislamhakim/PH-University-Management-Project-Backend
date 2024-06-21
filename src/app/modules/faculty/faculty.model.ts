import { Schema, model } from 'mongoose';
import { TFaculty } from './faculty.interface';

const facultySchemaName = {
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String },
};

const facultySchema = new Schema<TFaculty>(
  {
    id: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    designation: { type: String },
    name: { type: facultySchemaName, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: String, required: true },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true,
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    profileImg: { type: String },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Faculty = model<TFaculty>('Faculty', facultySchema);

export default Faculty;
