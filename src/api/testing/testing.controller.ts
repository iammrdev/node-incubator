import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TestingService } from './testing.service';

const deleteAllData = async (_req: Request, res: Response) => {
    await TestingService.deleteAllData();

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

export const TestingController = {
    deleteAllData,
};
