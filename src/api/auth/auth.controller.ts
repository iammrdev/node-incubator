import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from './auth.service.js';
import { UserLoginModel } from './auth.types.js';

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

    const isAuth = await AuthService.login(data);

    if (!isAuth) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

export const AuthController = {
    login,
};
