import { checkSchema } from 'express-validator';

export const loginSchema = checkSchema({
    login: {
        in: ['body'],
        trim: {},
        notEmpty: {},
    },
    password: {
        in: ['body'],
        trim: {},
        notEmpty: {},
    },
});
