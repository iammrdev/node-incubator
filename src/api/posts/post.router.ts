import { Router } from 'express';
import { basicAuth, bearerAuth } from '../auth/auth.middlewares.js';
import { createCommentSchema } from '../comments/comment.validator.js';
import { PostController } from './post.controller.js';
import { createPostSchema, getPostSchema } from './post.validator.js';

const postRouter = Router();

postRouter.route('/').get(PostController.getPosts).post(basicAuth, createPostSchema, PostController.createPost);
postRouter
    .route('/:id')
    .get(PostController.getPost)
    .put(basicAuth, createPostSchema, PostController.updatePost)
    .delete(basicAuth, PostController.deletePost);
postRouter
    .route('/:id/comments')
    .get(getPostSchema, PostController.getCommentsByPost)
    .post(bearerAuth, getPostSchema, createCommentSchema, PostController.createCommentByPost);

export { postRouter };