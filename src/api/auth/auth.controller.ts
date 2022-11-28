import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
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

export const AuthController = {
    login,
};
