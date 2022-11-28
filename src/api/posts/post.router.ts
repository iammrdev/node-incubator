import { Router } from 'express';
import { basicAuth, bearerAuth } from '../auth/auth.middlewares';
import { createCommentSchema } from '../comments/comment.validator';
import { PostController } from './post.controller';
import { createPostSchema, getPostSchema } from './post.validator';

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