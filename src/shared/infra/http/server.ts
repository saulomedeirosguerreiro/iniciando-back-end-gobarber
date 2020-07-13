import 'reflect-metadata';
import express, { json, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';
import '@shared/container';
import '@shared/infra/typeorm';

const app = express();

app.use(json());
app.use(routes);
app.use('/files', express.static(uploadConfig.directory));

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            return response.status(err.statusCode).json({
                status: 'error',
                message: err.message,
            });
        }

        console.error(err);

        return response.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
);

app.listen(3333, () => {
    console.log('Back-end Started on port 3333!');
});
