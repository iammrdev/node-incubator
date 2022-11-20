import { Router } from 'express';
import { basicAuth } from '../auth/auth.middlewares.js';
import { UserController } from './user.controller.js';
import { createUserSchema } from './user.validator.js';

const userRouter = Router();

userRouter.route('/').get(UserController.getUsers).post(basicAuth, createUserSchema, UserController.createUser);
userRouter.route('/:id').delete(basicAuth, UserController.deleteUser);

export { userRouter };
