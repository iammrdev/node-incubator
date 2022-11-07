import { Router } from 'express';
import { IndexController } from './index.controller.js';

const router = Router();

router.route('/').get(IndexController.health);

export default router;
