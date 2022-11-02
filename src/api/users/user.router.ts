import { Router } from 'express';
import { basicAuth } from '../auth/basic';
import { UserController } from './user.controller';

const router = Router();

router.route('/').get(UserController.getUsers).post(basicAuth, UserController.createUser);
router.route('/:id').delete(basicAuth, UserController.deleteUser);

export default router;
