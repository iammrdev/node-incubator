import { Router } from 'express';
import { basicAuth } from '../auth/auth.middlewares';
import { UserController } from './user.controller';
import { createUserSchema } from './user.validator';

const userRouter = Router();

userRouter.route('/')
    .get(UserController.getUsers)
    .post(basicAuth, createUserSchema, UserController.createUser);

userRouter.route('/:id').delete(basicAuth, UserController.deleteUser);

export { userRouter };
