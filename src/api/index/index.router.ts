import { Router } from 'express';
import { IndexController } from './index.controller.js';

const indexRouter = Router();

indexRouter.route('/').get(IndexController.health);

export { indexRouter };
