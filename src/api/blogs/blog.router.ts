import { Router } from 'express';
import { createPostByBlogSchema } from '../posts/post.validator';
import { BlogController } from './blog.controller';
import { createBlogSchema, getBlogSchema } from './blog.validator';

const blogRouter = Router();

blogRouter.route('/').get(BlogController.getBlogs).post(createBlogSchema, BlogController.createBlog);

blogRouter
    .route('/:id')
    .get(BlogController.getBlog)
    .put(createBlogSchema, BlogController.updateBlog)
    .delete(BlogController.deleteBlog);

blogRouter
    .route('/:id/posts')
    .get(getBlogSchema, BlogController.getPostsByBlog)
    .post(getBlogSchema, createPostByBlogSchema, BlogController.createPostByBlog);

export { blogRouter };
