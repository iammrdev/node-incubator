import { checkSchema } from 'express-validator';

export const createCommentSchema = checkSchema({
    content: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        isLength: {
            options: { min: 20, max: 300 },
        },
    },
});

export const setLikeStatusSchema = checkSchema({
    likeStatus: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        matches: {
            options: [/\b(?:None|Like|Dislike)\b/],
        },
    },
});
