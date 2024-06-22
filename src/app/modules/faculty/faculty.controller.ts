import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { facultyServices } from './faculty.service';

// get all faculty from DB
const getAllFaculty = catchAsync(async (req, res) => {
  const query = req.query;

  const data = await facultyServices.getAllFacultyFromDB(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'faculty retrieved successfully',
    data,
  });
});

// get single faculty from DB
const getSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params; // mongodb id

  const data = await facultyServices.getSingleFacultyFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Successfully retrieved a faculty',
    data,
  });
});
// update faculty from DB
const updateSpecificFacultyById = catchAsync(async (req, res) => {
  const { id } = req.params; // mongodb id
  const updatedFaculty = req.body;

  const data = await facultyServices.updateSpecificFacultyByIdFromDB(
    updatedFaculty,
    id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Successfully updated a faculty',
    data,
  });
});

// delete faculty from DB
const deleteSpecificFacultyById = catchAsync(async (req, res) => {
  const { id } = req.params; // mongodb id

  const data = await facultyServices.deleteSpecificFacultyByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Successfully deleted a faculty',
    data,
  });
});

export const facultyControllers = {
  getAllFaculty,
  getSingleFaculty,
  deleteSpecificFacultyById,
  updateSpecificFacultyById,
};
