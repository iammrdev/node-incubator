import { Router } from 'express';
import { TestingController } from './testing.controller';

const testingRouter = Router();

testingRouter.route('/all-data').delete(TestingController.deleteAllData);

export { testingRouter };
