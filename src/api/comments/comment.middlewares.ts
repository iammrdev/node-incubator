import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CommentService } from './comment.service.js';


export const commentAuth = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const comment = await CommentService.getComment(id)

    if (!comment) {
        res.sendStatus(StatusCodes.NOT_FOUND);

        return;
    }

    if (comment.userId !== req.user.id) {

        res.send(StatusCodes.FORBIDDEN)

        return;
    }
 
    next();
}