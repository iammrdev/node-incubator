import { Router } from 'express';
import { bearerAuth, bearerUser } from '../auth/auth.middlewares';
import { CommentController } from './comment.controller';
import { commentAuth } from './comment.middlewares';
import { createCommentSchema, setLikeStatusSchema } from './comment.validator';

const commentRouter = Router();

commentRouter
    .route('/:id')
    .get(bearerUser, CommentController.getComment)
    .put(bearerAuth, commentAuth, createCommentSchema, CommentController.updateComment)
    .delete(bearerAuth, commentAuth, CommentController.deleteComment);

commentRouter.route('/:id/like-status').put(bearerAuth, setLikeStatusSchema, CommentController.updateCommentLikes);

export { commentRouter };
