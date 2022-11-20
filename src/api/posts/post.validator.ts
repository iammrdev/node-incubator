import { body, checkSchema } from 'express-validator';
import { BlogRepository } from '../blogs/blog.repository.js';

export const name = body('name').isLength({ max: 15 });
export const websiteUrl = body('websiteUrl').isLength({ max: 100 }).isURL();

export const createPostSchema = checkSchema({
    title: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        isLength: {
            options: { max: 30 },
        },
    },
    shortDescription: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        isLength: {
            options: { max: 100 },
        },
    },
    content: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        isLength: {
            options: { max: 1000 },
        },
    },
    blogId: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        isLength: {
            options: { max: 100 },
        },
        custom: {
            options: async (value: string) => {
                const blog = await BlogRepository.getBlog(value);

                return blog ? Promise.resolve() : Promise.reject('Invalid blogId');
            },
        },
    },
});

export const createPostByBlogSchema = checkSchema({
    title: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        isLength: {
            options: { max: 30 },
        },
    },
    shortDescription: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        isLength: {
            options: { max: 100 },
        },
    },
    content: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        isLength: {
            options: { max: 1000 },
        },
    }
});

export const getPostSchema = checkSchema({
    id: {
        in: ['params'],
        isMongoId: {},
    },
});