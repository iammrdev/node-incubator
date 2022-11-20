import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { CommentService } from '../comments/comment.service.js';
import { CommentCreateModel } from '../comments/comment.types.js';
import { PostService } from './post.service.js';
import { Post } from './post.types.js';

const getPosts = async (req: Request, res: Response) => {
    const posts = await PostService.getAll({
        pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        sortBy: req.query.sortBy as string,
        sortDirection: req.query.sortDirection as 'asc' | 'desc',
    });

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


const getCommentsByPost = async (req: Request, res: Response) => {
    const id = req.params.id

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

    const result = await PostService.getById(id);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const comments = await CommentService.getCommentsByPost(id, {
        pageNumber: Number(req.query.pageNumber) || 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        sortBy: req.query.sortBy as string,
        sortDirection: req.query.sortDirection as 'asc' | 'desc',
    });


    return res.status(StatusCodes.OK).send(comments);
};

const createCommentByPost = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data: Pick<CommentCreateModel, 'content'> = req.body;


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

    const result2 = await PostService.getById(id);

    if (!result2) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const result = await CommentService.createCommentByPost(id, {
        content: data.content,
        userId: req.user.id,
        postId: id

    });

    return res.status(StatusCodes.CREATED).send(result);
};


export const PostController = {
    getPosts,
    getPost,
    deletePost,
    updatePost,
    createPost,
    createCommentByPost,
    getCommentsByPost

};
