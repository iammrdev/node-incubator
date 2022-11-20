import { Router } from 'express';
import { bearerAuth } from '../auth/auth.middlewares.js';
import { CommentController } from './comment.controller.js';
import { commentAuth } from './comment.middlewares.js';
import { createCommentSchema } from './comment.validator.js';

const commentRouter = Router();

commentRouter.route('/:id')
    .get(CommentController.getComment)
    .put(bearerAuth, commentAuth, createCommentSchema, CommentController.updateComment)
    .delete(bearerAuth, commentAuth, CommentController.deleteComment);

export { commentRouter };
