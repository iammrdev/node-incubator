import { Router } from 'express';
import { basicAuth } from '../auth/basic';
import { createPostByBlogSchema } from '../posts/post.validator';
import { BlogController } from './blog.controller';
import { createBlogSchema, getBlogSchema } from './blog.validator';

const router = Router();

router.route('/').get(BlogController.getBlogs).post(basicAuth, createBlogSchema, BlogController.createBlog);

router
    .route('/:id')
    .get(BlogController.getBlog)
    .put(basicAuth, createBlogSchema, BlogController.updateBlog)
    .delete(basicAuth, BlogController.deleteBlog);

router
    .route('/:id/posts')
    .get(getBlogSchema, BlogController.getPostsByBlog)
    .post(basicAuth, getBlogSchema, createPostByBlogSchema, BlogController.createPostByBlog)

export default router;
