import { Router } from 'express';
import { SecurityController } from './security.controller';

const securityRouter = Router();

securityRouter.route('/devices').get(SecurityController.getDevices);
securityRouter.route('/devices').delete(SecurityController.terminateDevices);
securityRouter.route('/devices/:id').delete(SecurityController.terminateDevice);

export { securityRouter };
