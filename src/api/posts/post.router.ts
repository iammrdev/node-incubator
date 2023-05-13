import { Router } from 'express';
import { createCommentSchema } from '../comments/comment.validator';
import { PostController } from './post.controller';
import { createPostSchema, getPostSchema, setLikeStatusSchema } from './post.validator';

const postRouter = Router();

postRouter
    .route('/')
    .get(PostController.getPosts)
    .post(createPostSchema, PostController.createPost);

postRouter
    .route('/:id')
    .get(PostController.getPost)
    .put(createPostSchema, PostController.updatePost)
    .delete(PostController.deletePost);

postRouter
    .route('/:id/comments')
    .get(getPostSchema, PostController.getCommentsByPost)
    .post(getPostSchema, createCommentSchema, PostController.createCommentByPost);

postRouter.route('/:id/like-status').put(setLikeStatusSchema, PostController.updatePostLikes);

export { postRouter };
