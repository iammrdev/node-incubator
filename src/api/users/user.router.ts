import { Router } from 'express';
import { UserController } from './user.controller';
import { createUserSchema } from './user.validator';

const userRouter = Router();

userRouter.route('/')
    .get(UserController.getUsers)
    .post(createUserSchema, UserController.createUser);

userRouter.route('/:id').delete(UserController.deleteUser);

export { userRouter };
