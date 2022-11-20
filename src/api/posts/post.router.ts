import { Router } from 'express';
import { basicAuth } from '../auth/auth.middlewares.js';
import { PostController } from './post.controller.js';
import { createPostSchema } from './post.validator.js';

const postRouter = Router();

postRouter.route('/').get(PostController.getPosts).post(basicAuth, createPostSchema, PostController.createPost);
postRouter
    .route('/:id')
    .get(PostController.getPost)
    .put(basicAuth, createPostSchema, PostController.updatePost)
    .delete(basicAuth, PostController.deletePost);

export { postRouter };
