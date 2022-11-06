import { Router } from 'express';
import { basicAuth } from '../auth/auth.middlewares.js';
import { UserController } from './user.controller.js';
import { createUserSchema } from './user.validator.js';

const router = Router();

router.route('/').get(UserController.getUsers).post(createUserSchema, UserController.createUser);
router.route('/:id').delete(basicAuth, UserController.deleteUser);

export default router;
