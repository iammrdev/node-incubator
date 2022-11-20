import { Router } from 'express';
import { TestingController } from './testing.controller.js';

const testingRouter = Router();

testingRouter.route('/all-data').delete(TestingController.deleteAllData);

export { testingRouter };
