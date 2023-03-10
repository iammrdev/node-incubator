import { LikeStatus } from '../comments/comment.repository';
import { UserResponseModel } from '../users/user.types';
import { PostRepository } from './post.repository';
import { GetPostsByBlogIdParams, Post } from './post.types';

const create = async (data: Omit<Post, 'id'>) => {
    return PostRepository.createPost(data);
};

const createPostByBlog = async (blogId: string, data: Omit<Post, 'id'>) => {
    return PostRepository.createPostByBlog(blogId, data);
};

const getAll = async (params: GetPostsByBlogIdParams, currentUserId?: string) => {
    return PostRepository.getAll(params, currentUserId);
};

const getAllByBlog = async (blogId: string, params: GetPostsByBlogIdParams, currentUserId?: string) => {
    return PostRepository.getAllByBlog(blogId, params, currentUserId);
};

const updateById = async (id: string, data: Post) => {
    return PostRepository.updatePost(id, data);
};

const deleteById = async (id: string) => {
    return PostRepository.deletePost(id);
};

const getById = async (id: string, currentUserId?: string) => {
    return PostRepository.getPost(id, currentUserId);
};

const setLikeStatus = async (likeStatus: LikeStatus, postId: string, user: UserResponseModel) => {
    if (likeStatus === LikeStatus.Like) {
        return PostRepository.likeComment(user, postId);
    }

    if (likeStatus === LikeStatus.Dislike) {
        return PostRepository.dislikeComment(user, postId);
    }

    return PostRepository.removeLikes(user, postId);
};

export const PostService = {
    create,
    createPostByBlog,
    getAll,
    getAllByBlog,
    updateById,
    deleteById,
    getById,
    setLikeStatus,
};
