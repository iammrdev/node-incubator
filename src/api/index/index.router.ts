import { Router } from 'express';
import { IndexController } from './index.controller';

const indexRouter = Router();

indexRouter.route('/').get(IndexController.health);

indexRouter.route('/email').get(IndexController.email);

export { indexRouter };
