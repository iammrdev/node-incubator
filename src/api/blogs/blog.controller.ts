import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { PostService } from '../posts/post.service';
import { Post } from '../posts/post.types';
import { BlogService } from './blog.service';
import { Blog } from './blog.types';

const getBlogs = async (req: Request, res: Response) => {
    const blogs = await BlogService.getAll({
        searchNameTerm: req.query.searchNameTerm as string || '',
        pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        sortBy: req.query.sortBy as string,
        sortDirection: req.query.sortDirection as 'asc' | 'desc',
    });

    return res.status(StatusCodes.OK).send(blogs);
};

const getBlog = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BlogService.getById(id);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).send(result);
};

const deleteBlog = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BlogService.deleteById(id);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

const createBlog = async (req: Request, res: Response) => {
    const data: Omit<Blog, 'id'> = req.body;

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

    const result = await BlogService.create(data);

    return res.status(StatusCodes.CREATED).send(result);
};

const updateBlog = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data: Blog = req.body;

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

    const result = await BlogService.updateById(id, data);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

const getPostsByBlog = async (req: Request, res: Response) => {
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

    const result = await BlogService.getById(id);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const blogs = await PostService.getAllByBlog(id, {
        pageNumber: Number(req.query.pageNumber) || 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        sortBy: req.query.sortBy as string,
        sortDirection: req.query.sortDirection as 'asc' | 'desc',
    });


    return res.status(StatusCodes.OK).send(blogs);
};

const createPostByBlog = async (req: Request, res: Response) => {
    const id = req.params.id;
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

    const result2 = await BlogService.getById(id);

    if (!result2) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const result = await PostService.createPostByBlog(id, data);

    return res.status(StatusCodes.CREATED).send(result);
};

export const BlogController = {
    getBlogs,
    getBlog,
    deleteBlog,
    updateBlog,
    createBlog,
    getPostsByBlog,
    createPostByBlog

};
