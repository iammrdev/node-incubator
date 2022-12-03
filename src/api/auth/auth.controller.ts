import isAfter from 'date-fns/isAfter';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { EmailService } from '../emails/email.service';
import { UserRepository } from '../users/user.repository';
import { UserService } from '../users/user.service';
import { UserCreateModel } from '../users/user.types';
import { AuthService } from './auth.service';
import { UserLoginModel } from './auth.types';

const login = async (req: Request, res: Response) => {
    const data: UserLoginModel = req.body;

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

    const token = await AuthService.login(data);

    if (!token) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    return res.status(StatusCodes.OK).send(token);
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

export const AuthController = {
    login,
    createUser,
    confirmRegistration,
    resendConfirmation,
    getAuthInfo,
};
