import { body, checkSchema } from 'express-validator';

export const name = body('name').isLength({ max: 15 });
export const websiteUrl = body('websiteUrl').isLength({ max: 100 }).isURL();

export const getBlogSchema = checkSchema({
    id: {
        in: ['params'],
        isMongoId: {},
    },
});

export const createBlogSchema = checkSchema({
    name: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        isLength: {
            options: { max: 15 },
        },
    },
    websiteUrl: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        isLength: {
            options: { max: 100 },
        },
        isURL: {},
    },
});
