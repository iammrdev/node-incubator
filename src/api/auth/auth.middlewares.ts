import { NextFunction, Request, Response } from 'express';
import auth from 'express-basic-auth';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../users/user.service';

export const basicAuth = auth({
    users: { admin: 'qwerty' },
});

export const bearerAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(StatusCodes.UNAUTHORIZED);

        return;
    }

    const [type, token] = req.headers.authorization.split(' ');
    const userId = await UserService.getUserIdByToken(token);

    if (!type || !userId) {
        res.send(StatusCodes.UNAUTHORIZED);

        return;
    }

    const { user } = await UserService.getUser(userId.toString());

    if (!user) {
        res.send(StatusCodes.UNAUTHORIZED);

        return;
    }

    req.user = user;

    next();
};

export const bearerUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return next();
    }

    const [type, token] = req.headers.authorization.split(' ');
    const userId = await UserService.getUserIdByToken(token);

    if (!type || !userId) {
        return next();
    }

    const { user } = await UserService.getUser(userId.toString());

    if (!user) {
        return next();
    }

    req.user = user;

    next();
};

export const checkRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken || typeof refreshToken !== 'string') {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    next();
};
