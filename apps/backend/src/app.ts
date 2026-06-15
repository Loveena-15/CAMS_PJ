import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/error.middleware';
import routes from './routes';
import { AppError } from './utils/AppError';

const app: Application = express();

// 1. Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// 2. Routes
app.use('/api/v1', routes);
// Root fallback
app.get('/', (req, res) => res.send('CAMS API is running...'));

// 3. Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4. Global Error Handling Middleware
app.use(errorHandler);

export default app;
