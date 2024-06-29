import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.const';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemesterObjId = payload?.academicSemester;

  // check if already a semester UPCOMING / ONGOING . then can't create a new semester
  const existsSemesterUpcomingOrOngoing = await SemesterRegistration.findOne({
    $or: [
      { status: RegistrationStatus.UPCOMING },
      { status: RegistrationStatus.ONGOING },
    ],
  });

  if (existsSemesterUpcomingOrOngoing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't register semester when a semester ${existsSemesterUpcomingOrOngoing.status}`,
    );
  }

  // check if the academic semester is exists
  const isAcademicSemesterExists = await AcademicSemester.findById(
    academicSemesterObjId,
  );
  if (!isAcademicSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This academic semester is not found!',
    );
  }

  // check if the semester already registration
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester: academicSemesterObjId,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This semester is already registered!',
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;

  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');
  return result;
};

const updateSpecificSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // check if the requested semester is exists
  const isExistsSemesterRegistration = await SemesterRegistration.findById(id);
  if (!isExistsSemesterRegistration) {
    throw new AppError(httpStatus.NOT_FOUND, 'This semester is not found !');
  }

  const currentSemesterStatus = isExistsSemesterRegistration?.status;
  const requestedSemesterStatus = payload?.status;

  // if the requested semester is already ended . then give em an error msg
  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(httpStatus.BAD_REQUEST, 'The semester is already ENDED');
  }

  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedSemesterStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't chance directly semester status UPCOMING to ENDED",
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedSemesterStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't chance directly semester status from ONGOING to UPCOMING",
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const semesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSpecificSemesterRegistrationIntoDB,
};
