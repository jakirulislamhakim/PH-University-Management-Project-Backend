import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Students are retrieved successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;

  const result = await StudentServices.getSingleStudentFromDB(studentId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Student are retrieved successfully',
    data: result,
  });
});

const deleteSpecificStudentById = catchAsync(async (req, res) => {
  const { studentId } = req.params;

  const result = await StudentServices.deleteSpecificStudentByIdIntoDB(studentId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Student deleted successfully',
    data: result,
  });
});

const updateStudentById = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const { student: StudentData } = req.body;

  const result = await StudentServices.updateStudentByIdIntoDB(studentId, StudentData);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Student deleted successfully',
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteSpecificStudentById,
  updateStudentById
};
