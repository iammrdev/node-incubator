import { Router } from 'express';
import { CommentController } from './comment.controller';
import { commentAuth } from './comment.middlewares';
import { createCommentSchema, setLikeStatusSchema } from './comment.validator';

const commentRouter = Router();

commentRouter
    .route('/:id')
    .get(CommentController.getComment)
    .put(commentAuth, createCommentSchema, CommentController.updateComment)
    .delete(commentAuth, CommentController.deleteComment);

commentRouter.route('/:id/like-status').put(setLikeStatusSchema, CommentController.updateCommentLikes);

export { commentRouter };
