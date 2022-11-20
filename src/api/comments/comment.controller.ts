import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { CommentService } from './comment.service.js';
import { CommentCreateModel } from './comment.types.js';


const getComment = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CommentService.getComment(id);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).send(result);
};

const deleteComment = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CommentService.deleteComment(id);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

const updateComment = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data: CommentCreateModel = req.body;

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

    const result = await CommentService.updateComment(id, data);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

export const CommentController = {
    getComment,
    updateComment,
    deleteComment,
};
