import { body, checkSchema } from 'express-validator';
import { BlogRepository } from '../blogs/blog.repository';

export const name = body('name').isLength({ max: 15 });
export const youtubeUrl = body('youtubeUrl').isLength({ max: 100 }).isURL();

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
            options: (value: string) => {
                const blog = BlogRepository.getBlog(value);

                if (!blog) {
                    return Promise.reject('Invalid blogId');
                }

                return Promise.resolve();
            },
        },
    },
});
