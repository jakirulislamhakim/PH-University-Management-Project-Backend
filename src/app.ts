import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFoundRoute from './app/middleware/notFoundRoute';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

// parsers
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173/'],
  }),
);
app.use(cookieParser());

// application routes
app.use('/api/v1', router);

const test = async (req: Request, res: Response) => {
  res.send({
    success: true,
    message: 'PH University is running',
  });
};

app.get('/', test);

// global error handle
app.use(globalErrorHandler);
// not found route
app.all('*', notFoundRoute);

export default app;
