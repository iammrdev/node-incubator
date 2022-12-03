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

export const registrationConfirmationSchema = checkSchema({
    code: {
        in: ['body'],
        trim: {},
        notEmpty: {},
    },
});

export const registrationEmailResendingSchema = checkSchema({
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
