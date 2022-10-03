import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { PostService } from './post.service';
import { Post } from './post.types';

const getPosts = async (_req: Request, res: Response) => {
    const posts = await PostService.getAll();

    return res.status(StatusCodes.OK).send(posts);
};

const getPost = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await PostService.getById(id);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).send(result);
};

const deletePost = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await PostService.deleteById(id);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

const createPost = async (req: Request, res: Response) => {
    const data: Omit<Post, 'id'> = req.body;

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

    const result = await PostService.create(data);

    return res.status(StatusCodes.CREATED).send(result);
};

const updatePost = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data: Post = req.body;

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

    const result = await PostService.updateById(id, data);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

export const PostController = {
    getPosts,
    getPost,
    deletePost,
    updatePost,
    createPost,
};
