import { Router } from 'express';
import { bearerAuth } from '../auth/auth.middlewares.js';
import { CommentController } from './comment.controller.js';
import { createCommentSchema } from './comment.validator.js';

const commentRouter = Router();

commentRouter.route('/:id')
    .get(CommentController.getComment)
    .put(bearerAuth, createCommentSchema, CommentController.updateComment)
    .delete(bearerAuth, CommentController.deleteComment);

export { commentRouter };
