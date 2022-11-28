import { CommentRepository } from './comment.repository';
import { CommentCreateModel, GetCommentsByPostParams } from './comment.types';

const getComment = async (id: string) => {
    return CommentRepository.getComment(id);
};

const updateComment = async (id: string, data: CommentCreateModel) => {
    return CommentRepository.updateComment(id, data);
};

const deleteComment = async (id: string) => {
    return CommentRepository.deleteComment(id);
};

const getCommentsByPost = async (postId: string, params: GetCommentsByPostParams) => {
    return CommentRepository.getCommentsByPost(postId, params);
};

const createCommentByPost = async (postId: string, params: CommentCreateModel) => {
    return CommentRepository.createCommentByPost(postId, params);
};




export const CommentService = {
    getComment,
    updateComment,
    deleteComment,
    getCommentsByPost,
    createCommentByPost
};
