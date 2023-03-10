import { Router } from 'express';
import { basicAuth, bearerUser } from '../auth/auth.middlewares';
import { createPostByBlogSchema } from '../posts/post.validator';
import { BlogController } from './blog.controller';
import { createBlogSchema, getBlogSchema } from './blog.validator';

const blogRouter = Router();

blogRouter.route('/').get(BlogController.getBlogs).post(basicAuth, createBlogSchema, BlogController.createBlog);

blogRouter
    .route('/:id')
    .get(bearerUser, BlogController.getBlog)
    .put(basicAuth, createBlogSchema, BlogController.updateBlog)
    .delete(basicAuth, BlogController.deleteBlog);

blogRouter
    .route('/:id/posts')
    .get(bearerUser, getBlogSchema, BlogController.getPostsByBlog)
    .post(basicAuth, getBlogSchema, createPostByBlogSchema, BlogController.createPostByBlog);

export { blogRouter };
