import { Router } from 'express';
import { AuthController } from './auth.controller';
import { loginSchema } from './auth.validator';

const authRouter = Router();

authRouter.route('/login').post(loginSchema, AuthController.login);

export { authRouter };
