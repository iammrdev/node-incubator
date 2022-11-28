import { Router } from 'express';
import { basicAuth } from '../auth/auth.middlewares';
import { createPostByBlogSchema } from '../posts/post.validator';
import { BlogController } from './blog.controller';
import { createBlogSchema, getBlogSchema } from './blog.validator';

const blogRouter = Router();

blogRouter.route('/').get(BlogController.getBlogs).post(basicAuth, createBlogSchema, BlogController.createBlog);

blogRouter
    .route('/:id')
    .get(BlogController.getBlog)
    .put(basicAuth, createBlogSchema, BlogController.updateBlog)
    .delete(basicAuth, BlogController.deleteBlog);

blogRouter
    .route('/:id/posts')
    .get(getBlogSchema, BlogController.getPostsByBlog)
    .post(basicAuth, getBlogSchema, createPostByBlogSchema, BlogController.createPostByBlog);

export { blogRouter };
