import { CommentRepository, LikeStatus } from './comment.repository';
import { CommentCreateModel, GetCommentsByPostParams } from './comment.types';

const getComment = async (id: string, currentUserId?: string) => {
    return CommentRepository.getComment(id, currentUserId);
};

const updateComment = async (id: string, data: CommentCreateModel) => {
    return CommentRepository.updateComment(id, data);
};

const deleteComment = async (id: string) => {
    return CommentRepository.deleteComment(id);
};

const getCommentsByPost = async (postId: string, params: GetCommentsByPostParams, currentUserId?: string) => {
    return CommentRepository.getCommentsByPost(postId, params, currentUserId);
};

const createCommentByPost = async (postId: string, params: CommentCreateModel) => {
    return CommentRepository.createCommentByPost(postId, params);
};

const setLikeStatus = async (likeStatus: LikeStatus, commentId: string, userId: string) => {
    if (likeStatus === LikeStatus.Like) {
        return CommentRepository.likeComment(userId, commentId);
    }

    if (likeStatus === LikeStatus.Dislike) {
        return CommentRepository.dislikeComment(userId, commentId);
    }

    return CommentRepository.removeLikes(userId, commentId);
};

export const CommentService = {
    getComment,
    updateComment,
    deleteComment,
    getCommentsByPost,
    createCommentByPost,
    setLikeStatus,
};
