import { checkSchema } from 'express-validator';

export const loginSchema = checkSchema({
    loginOrEmail: {
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
