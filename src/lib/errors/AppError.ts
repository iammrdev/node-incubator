import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
    statusCode: number;
    meta: Record<string, any>;

    constructor(statusCode: StatusCodes, message: string = '', meta: Record<string, any> = {}) {
        super(message);

        this.statusCode = statusCode;
        this.meta = meta;
    }
}
