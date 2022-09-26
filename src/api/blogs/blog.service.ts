import { BlogRepository } from './blog.repository';
import { Blog } from './blog.types';

const create = async (data: Omit<Blog, 'id'>) => {
    return BlogRepository.createBlog(data);
};

const getAll = async () => {
    return BlogRepository.getAll();
};

const updateById = async (id: number, data: Blog) => {
    return BlogRepository.updateBlog(id, data);
};

const deleteById = async (id: number) => {
    return BlogRepository.deleteBlog(id);
};

const getById = async (id: number) => {
    return BlogRepository.getBlog(id);
};

export const BlogService = {
    create,
    getAll,
    updateById,
    deleteById,
    getById,
};
