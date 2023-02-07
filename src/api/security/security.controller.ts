import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../users/user.service';
import { AuthRepository } from '../auth/auth.repository';

const getDevices = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const userId = await UserService.getUserIdByToken(refreshToken);

    if (!userId) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const tokens = await AuthRepository.getTokens(userId.toString());

    if (!tokens.length) {
        return res.send([]);
    }

    return res.send(
        tokens.map((item) => ({
            ip: item.ip,
            title: item.title,
            deviceId: item.deviceId,
            lastActiveDate: new Date(item.iat * 1000),
        })),
    );
};

const terminateDevices = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const userId = await UserService.getUserIdByToken(refreshToken);

    if (!userId) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const refreshTokenPayload = jwt.decode(refreshToken) as JwtPayload;

    console.log({ refreshToken, userId: userId.toString(), refreshTokenPayload });

    await AuthRepository.deleteAllByUser(userId.toString(), refreshTokenPayload.deviceId);

    return res.sendStatus(204);
};

const terminateDevice = async (req: Request, res: Response) => {
    const deviceId = req.params.id;
    const refreshToken = req.cookies.refreshToken;

    const userId = await UserService.getUserIdByToken(refreshToken);

    if (!userId) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const result = await AuthRepository.deleteByUser(userId.toString(), deviceId);

    if (result == 403) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
    }

    if (result === 404) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.sendStatus(204);
};

export const SecurityController = {
    getDevices,
    terminateDevices,
    terminateDevice,
};
