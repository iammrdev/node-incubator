import { Router } from 'express';
import { PostController } from './post.controller';

const router = Router();

router.route('/').get(PostController.getPosts).post(PostController.createPost);
router.route('/:id').get(PostController.getPost).put(PostController.updatePost).delete(PostController.deletePost);

export default router;
