import { Types } from 'mongoose';

export type TFacultyName = {
  firstName: string;
  lastName: string;
  middleName?: string;
};

export type TFaculty = {
  id?: string; // generated id
  user?: Types.ObjectId; // ObjectId
  designation: string;
  name: TFacultyName;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  profileImg: string;
  academicDepartment: Types.ObjectId; // ObjectId
  isDeleted?: boolean;
};
