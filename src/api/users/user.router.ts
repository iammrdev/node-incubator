import { Router } from 'express';
import { basicAuth } from '../auth/basic.js';
import { UserController } from './user.controller.js';

const router = Router();

router.route('/').get(UserController.getUsers).post(basicAuth, UserController.createUser);
router.route('/:id').delete(basicAuth, UserController.deleteUser);

export default router;
