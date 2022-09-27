import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PostService } from './post.service';
import { Post } from './post.types';
// import { PostValidator } from './post.validator';

const getPosts = async (_req: Request, res: Response) => {
    const posts = await PostService.getAll();

    return res.status(StatusCodes.OK).send(posts);
};

const getPost = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const result = await PostService.getById(id);

    if (!result) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    return res.status(StatusCodes.OK).send(result.item);
};

const deletePost = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const result = await PostService.deleteById(id);

    if (!result) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

const createPost = async (req: Request, res: Response) => {
    const data: Omit<Post, 'id'> = req.body;

    // const errors = PostValidator.validateData(data);

    // if (errors.length) {
    //     res.status(StatusCodes.BAD_REQUEST).send({ errorsMessages: errors });
    //     return;
    // }

    const result = await PostService.create(data);

    return res.status(StatusCodes.CREATED).send(result.item);
};

const updatePost = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data: Post = req.body;

    // const errors = PostValidator.validateData(data);

    // if (errors.length) {
    //     res.status(StatusCodes.BAD_REQUEST).send({ errorsMessages: errors });
    //     return;
    // }

    const result = await PostService.updateById(id, data);

    if (!result) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
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
