import { Router } from 'express';
import { BlogController } from './blog.controller';
import { createBlogSchema } from './blog.validator';

const router = Router();

router.route('/').get(BlogController.getBlogs).post(createBlogSchema, BlogController.createBlog);
router.route('/:id').get(BlogController.getBlog).put(createBlogSchema, BlogController.updateBlog).delete(BlogController.deleteBlog);

export default router;
