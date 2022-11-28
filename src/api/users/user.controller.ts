import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './user.service';
import { UserCreateModel } from './user.types';


const getUsers = async (req: Request, res: Response) => {
    const users = await UserService.getUsers({
        searchLoginTerm: req.query.searchLoginTerm as string || '',
        searchEmailTerm: req.query.searchEmailTerm as string || '',
        pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        sortBy: req.query.sortBy as string,
        sortDirection: req.query.sortDirection as 'asc' | 'desc',
    });

    return res.status(StatusCodes.OK).send(users);
};

const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await UserService.deleteUser(id);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
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

    const result = await UserService.createUser(data);

    return res.status(StatusCodes.CREATED).send(result);
};

export const UserController = {
    getUsers,
    createUser,
    deleteUser,
};
