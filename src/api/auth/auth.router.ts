import { Router } from 'express';
import { createUserSchema } from '../users/user.validator';
import { AuthController } from './auth.controller';
import { bearerAuth } from './auth.middlewares';
import { loginSchema, registrationConfirmationSchema, registrationEmailResendingSchema } from './auth.validator';

const authRouter = Router();

authRouter.route('/login').post(loginSchema, AuthController.login);
authRouter.route('/registration-confirmation').post(registrationConfirmationSchema, AuthController.confirmRegistration);
authRouter.route('/registration').post(createUserSchema, AuthController.createUser);
authRouter
    .route('/registration-email-resending')
    .post(registrationEmailResendingSchema, AuthController.resendConfirmation);
authRouter.route('/me').get(bearerAuth, AuthController.getAuthInfo);

export { authRouter };
