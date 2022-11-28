import { Router } from 'express';
import { bearerAuth } from '../auth/auth.middlewares';
import { CommentController } from './comment.controller';
import { commentAuth } from './comment.middlewares';
import { createCommentSchema } from './comment.validator';

const commentRouter = Router();

commentRouter.route('/:id')
    .get(CommentController.getComment)
    .put(bearerAuth, commentAuth, createCommentSchema, CommentController.updateComment)
    .delete(bearerAuth, commentAuth, CommentController.deleteComment);

export { commentRouter };
