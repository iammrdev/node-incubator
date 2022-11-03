import { Router } from 'express';
import { TestingController } from './testing.controller.js';

const router = Router();

router.route('/all-data').delete(TestingController.deleteAllData);

export default router;
