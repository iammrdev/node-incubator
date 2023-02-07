import { Router } from 'express';
import { verifyIP } from '../security/security.middleware';
import { createUserSchema } from '../users/user.validator';
import { AuthController } from './auth.controller';
import { bearerAuth, checkRefreshToken } from './auth.middlewares';
import { loginSchema, registrationConfirmationSchema, registrationEmailResendingSchema } from './auth.validator';

const authRouter = Router();

authRouter.route('/login').post(verifyIP, loginSchema, AuthController.login);
authRouter.route('/logout').post(AuthController.logout);
authRouter
    .route('/registration-confirmation')
    .post(verifyIP, registrationConfirmationSchema, AuthController.confirmRegistration);
authRouter.route('/registration').post(verifyIP, createUserSchema, AuthController.createUser);
authRouter
    .route('/registration-email-resending')
    .post(verifyIP, registrationEmailResendingSchema, AuthController.resendConfirmation);
authRouter.route('/refresh-token').post(checkRefreshToken, AuthController.refreshToken);
authRouter.route('/me').get(bearerAuth, AuthController.getAuthInfo);

export { authRouter };
