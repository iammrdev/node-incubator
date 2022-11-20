import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { loginSchema } from './auth.validator.js';

const authRouter = Router();

authRouter.route('/login').post(loginSchema, AuthController.login);

export { authRouter };
