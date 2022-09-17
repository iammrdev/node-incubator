import { Router } from 'express';
import { TestingController } from './testing.controller';

const router = Router();

router.route('/all-data').delete(TestingController.deleteAllData);

export default router;
