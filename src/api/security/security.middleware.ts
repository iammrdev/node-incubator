import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SecurityRepository } from './security.repository';

const cache: Map<string, { ip: string; url: string; timestamp: number }[]> = new Map();

export const verifyIP = (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;
    const now = Date.now();

    const key = `${req.ip}-${url}`;

    const attempts = (cache.get(key) || [])
        .filter((item) => item.timestamp > now)
        .map((item) => ({ ...item, timestamp: now + 10000 }))
        .concat([{ ip: req.ip, timestamp: now + 10000, url }]);

    cache.set(key, attempts);

    if (attempts.length > 5) {
        return res.sendStatus(StatusCodes.TOO_MANY_REQUESTS);
    }

    next();
};
