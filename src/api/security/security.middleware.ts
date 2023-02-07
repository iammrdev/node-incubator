import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SecurityRepository } from './security.repository';

export const verifyIP = async (req: Request, res: Response, next: NextFunction) => {
    const attempts = await SecurityRepository.getAttemptsByIp(req.ip, Date.now() - 10000);

    if (attempts.length >= 5) {
        return res.sendStatus(StatusCodes.TOO_MANY_REQUESTS);
    }

    await SecurityRepository.saveAuthAttempt({ ip: req.ip, timestamp: Date.now() });

    next();
};
