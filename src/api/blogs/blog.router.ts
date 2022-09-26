import { Router } from 'express';
import { BlogController } from './blog.controller';

const router = Router();

router.route('/').get(BlogController.getBlogs).post(BlogController.createBlog);
router.route('/:id').get(BlogController.getBlog).put(BlogController.updateBlog).delete(BlogController.deleteBlog);

export default router;
