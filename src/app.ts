import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFoundRoute from './app/middleware/notFoundRoute';
import router from './app/routes';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
  res.send({
    success: true,
    message: 'PH University is running',
  });
};

app.get('/', test);

// error handle
app.use(globalErrorHandler);
// not found route
app.all('*', notFoundRoute);

export default app;
