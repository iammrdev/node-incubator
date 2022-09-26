import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BlogService } from './blog.service';
import { Blog } from './blog.types';
import { BlogValidator } from './blog.validator';

const getBlogs = async (_req: Request, res: Response) => {
    const blogs = await BlogService.getAll();

    return res.status(StatusCodes.OK).send(blogs);
};

const getBlog = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const result = await BlogService.getById(id);

    if (!result) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    return res.status(StatusCodes.OK).send(result.item);
};

const deleteBlog = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const result = await BlogService.deleteById(id);

    if (!result) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

const createBlog = async (req: Request, res: Response) => {
    const data: Omit<Blog, 'id'> = req.body;

    const errors = BlogValidator.validateData(data);

    if (errors.length) {
        res.status(StatusCodes.BAD_REQUEST).send({ errorsMessages: errors });
        return;
    }

    const result = await BlogService.create(data);

    return res.status(StatusCodes.CREATED).send(result.item);
};

const updateBlog = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data: Blog = req.body;

    const errors = BlogValidator.validateData(data);

    if (errors.length) {
        res.status(StatusCodes.BAD_REQUEST).send({ errorsMessages: errors });
        return;
    }

    const result = await BlogService.updateById(id, data);

    if (!result) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

export const BlogController = {
    getBlogs,
    getBlog,
    deleteBlog,
    updateBlog,
    createBlog,
};
