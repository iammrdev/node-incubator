import { checkSchema } from 'express-validator';
import { UserRepository } from './user.repository';

export const createUserSchema = checkSchema({
    login: {
        in: ['body'],
        trim: {},
        notEmpty: {},
        isLength: {
            options: { min: 3, max: 10 },
        },
        custom: {
            options: async (value: string) => {
                const user = await UserRepository.getUserByLoginOrEmail(value);

                if (user) {
                    return Promise.reject('login exists');
                }

                const isValid = /^[a-zA-Z0-9_-]*$/.test(value);

                if (!isValid) {
                    return Promise.reject('invalid login');
                }
                return Promise.resolve();
            },
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
            options: async (value: string) => {
                const user = await UserRepository.getUserByLoginOrEmail(value);

                if (user) {
                    return Promise.reject('email exists');
                }

                const isValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);

                if (!isValid) {
                    return Promise.reject('invalid email');
                }
                return Promise.resolve();
            },
        },
    },
});
