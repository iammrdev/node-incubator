import { GetPostsByBlogIdParams } from '../posts/post.types.js';
import { BlogRepository } from './blog.repository.js';
import { Blog } from './blog.types.js';

const create = async (data: Omit<Blog, 'id'>) => {
    const blog = {
        name: data.name,
        youtubeUrl: data.youtubeUrl,
    };

    return BlogRepository.createBlog(blog);
};

const getAll = async (params: GetPostsByBlogIdParams) => {
    return BlogRepository.getAll(params);
};

const updateById = async (id: string, data: Blog) => {
    return BlogRepository.updateBlog(id, data);
};

const deleteById = async (id: string) => {
    return BlogRepository.deleteBlog(id);
};

const getById = async (id: string) => {
    return BlogRepository.getBlog(id);
};

export const BlogService = {
    create,
    getAll,
    updateById,
    deleteById,
    getById,
};
