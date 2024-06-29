import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { semesterRegistrationServices } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(async (req, res) => {
  const semesterRegistrationData = req.body;

  const data =
    await semesterRegistrationServices.createSemesterRegistrationIntoDB(
      semesterRegistrationData,
    );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Successfully created a semester registration',
    data,
  });
});

const getAllSemesterRegistration = catchAsync(async (req, res) => {
  const data =
    await semesterRegistrationServices.getAllSemesterRegistrationFromDB(
      req.query,
    );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Semester registration is successfully retrieved .',
    data,
  });
});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data =
    await semesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Successfully get a semester registration',
    data,
  });
});

const updateSpecificSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedSemesterRegistrationData = req.body;

  const data =
    await semesterRegistrationServices.updateSpecificSemesterRegistrationIntoDB(
      id,
      updatedSemesterRegistrationData,
    );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Successfully updated semester registration',
    data,
  });
});

export const semesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSpecificSemesterRegistration,
};
