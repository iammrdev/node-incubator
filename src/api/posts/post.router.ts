import { Router } from 'express';
import { basicAuth } from '../auth/basic';
import { PostController } from './post.controller';
import { createPostSchema } from './post.validator';

const router = Router();

router.route('/').get(PostController.getPosts).post(basicAuth, createPostSchema, PostController.createPost);
router
    .route('/:id')
    .get(PostController.getPost)
    .put(basicAuth, createPostSchema, PostController.updatePost)
    .delete(basicAuth, PostController.deletePost);

export default router;
