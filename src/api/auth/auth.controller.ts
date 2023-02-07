import isAfter from 'date-fns/isAfter';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { EmailService } from '../emails/email.service';
import { UserRepository } from '../users/user.repository';
import { UserService } from '../users/user.service';
import { UserCreateModel } from '../users/user.types';
import { AuthService } from './auth.service';
import { UserLoginModel } from './auth.types';
import { AuthRepository } from './auth.repository';

const login = async (req: Request, res: Response) => {
    const data: UserLoginModel = {
        ...req.body,
        ip: req.ip,
        title: req.headers['user-agent'],
    };

    const errors = validationResult.withDefaults({
        formatter: (error) => {
            return {
                field: error.param,
                message: error.msg,
            };
        },
    })(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            errorsMessages: errors.array({ onlyFirstError: true }),
        });
    }

    const tokens = await AuthService.login(data);

    if (!tokens) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    res.cookie('refreshToken', tokens.refreshToken, {
        secure: process.env.NODE_ENV !== 'development',
        httpOnly: true,
    });

    return res.status(StatusCodes.OK).send({ accessToken: tokens.accessToken });
};

const createUser = async (req: Request, res: Response) => {
    const data: UserCreateModel = req.body;

    const errors = validationResult.withDefaults({
        formatter: (error) => {
            return {
                field: error.param,
                message: error.msg,
            };
        },
    })(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            errorsMessages: errors.array({ onlyFirstError: true }),
        });
    }

    const { user, confirmation } = await UserService.createUser(data);

    if (!user) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    const info = await EmailService.sendEmail({
        email: user.email,
        code: confirmation.code,
    });

    if (!info.messageId) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

const confirmRegistration = async (req: Request, res: Response) => {
    const errors = validationResult.withDefaults({
        formatter: (error) => {
            return {
                field: error.param,
                message: error.msg,
            };
        },
    })(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            errorsMessages: errors.array({ onlyFirstError: true }),
        });
    }

    const user = await UserRepository.getUserByConfirmationCode(req.body.code);

    if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            errorsMessages: [
                { message: 'confirmation code is incorrect, expired or already been applied', field: 'code' },
            ],
        });
    }

    const isExp = isAfter(new Date(), user.confirmation.expiration);

    if (isExp || user.confirmation.code !== req.body.code || user.confirmation.status) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            errorsMessages: [
                { message: 'confirmation code is incorrect, expired or already been applied', field: 'code' },
            ],
        });
    }

    await UserRepository.updateUserConfirmation(user._id.toString(), {
        ...user.confirmation,
        status: true,
        activation: new Date(),
    });

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

const resendConfirmation = async (req: Request, res: Response) => {
    const user = await UserRepository.getUserByLoginOrEmail(req.body.email);

    const errors = validationResult.withDefaults({
        formatter: (error) => {
            return {
                field: error.param,
                message: error.msg,
            };
        },
    })(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            errorsMessages: errors.array({ onlyFirstError: true }),
        });
    }

    if (!user || user.confirmation.status) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            errorsMessages: [{ message: 'incorrect values or if email is already confirmed', field: 'email' }],
        });
    }

    const result = await UserRepository.updateUserConfirmation(user._id.toString(), {
        ...user.confirmation,
        code: uuidv4(),
        expiration: add(new Date(), { minutes: 60 }),
    });

    if (!result?.user) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    const info = await EmailService.sendEmail({
        email: user.email,
        code: result.confirmation.code,
    });

    if (!info.messageId) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

const getAuthInfo = async (req: Request, res: Response) => {
    const authInfo = {
        userId: req.user.id,
        login: req.user.login,
        email: req.user.email,
    };
    return res.status(StatusCodes.OK).send(authInfo);
};

const logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    //@todo: validate token
    const userId = await UserService.getUserIdByToken(refreshToken);
    const tokenInfo = await AuthRepository.getTokenInfo(refreshToken);

    if (!userId || !tokenInfo) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const result = await AuthRepository.deleteToken(refreshToken);

    if (!result) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const userId = await UserService.getUserIdByToken(refreshToken);
    const tokenInfo = await AuthRepository.getTokenInfo(refreshToken);

    if (!userId || !tokenInfo) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const result = await AuthRepository.deleteToken(refreshToken);

    if (!result) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const tokens = {
        accessToken: UserService.createJWT(userId.toString(), { expiresIn: '10s' }),
        refreshToken: UserService.createJWT(userId.toString(), { deviceId: tokenInfo.deviceId, expiresIn: '20s' }),
    };

    const refreshTokenPayload = jwt.decode(tokens.refreshToken) as JwtPayload;

    const saveTokenResult = await AuthRepository.saveRefreshToken({
        userId: userId.toString(),
        deviceId: refreshTokenPayload.deviceId,
        ip: req.ip,
        title: req.headers['user-agent']!,
        refreshToken: tokens.refreshToken,
        iat: refreshTokenPayload.iat!,
        exp: refreshTokenPayload.exp!,
    });

    if (!saveTokenResult) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    res.cookie('refreshToken', tokens.refreshToken, {
        secure: process.env.NODE_ENV !== 'development',
        httpOnly: true,
    });

    return res.status(StatusCodes.OK).send({ accessToken: tokens.accessToken });
};

export const AuthController = {
    login,
    logout,
    createUser,
    confirmRegistration,
    resendConfirmation,
    getAuthInfo,
    refreshToken,
};
