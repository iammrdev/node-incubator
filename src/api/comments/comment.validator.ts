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
