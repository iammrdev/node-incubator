import { Router } from 'express';
import { basicAuth } from '../auth/basic';
import { BlogController } from './blog.controller';
import { createBlogSchema } from './blog.validator';

const router = Router();

router.route('/').get(BlogController.getBlogs).post(basicAuth, createBlogSchema, BlogController.createBlog);
router
    .route('/:id')
    .get(BlogController.getBlog)
    .put(basicAuth, createBlogSchema, BlogController.updateBlog)
    .delete(basicAuth, BlogController.deleteBlog);

router
    .route('/:id/posts')
    .get(BlogController.getPostsByBlog)

export default router;
