import express from 'express';
import { userControllers } from './user.controller';

const userRouter = express.Router();

userRouter.post('/create-student', userControllers.createStudent);

export default userRouter;
