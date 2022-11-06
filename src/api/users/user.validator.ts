import { checkSchema } from 'express-validator';

export const createUserSchema = checkSchema({
    login: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        isLength: {
            options: { min: 3, max: 10 },
        },
    },
    password: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        isLength: {
            options: { min: 6, max: 20 },
        },
    },
    email: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        custom: {
            options: (value: string) => {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            },
        },
    },
});
