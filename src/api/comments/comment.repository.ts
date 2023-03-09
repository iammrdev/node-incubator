import { ObjectId, WithId } from 'mongodb';
import { commentsCollection } from '../../lib/db/index';
import { UserRepository } from '../users/user.repository';
import { UserResponseModel } from '../users/user.types';
import { Comment, CommentCreateModel, CommentResponseModel, GetCommentsByPostParams } from './comment.types';

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}

const createCommentDto = (comment: WithId<Comment>, currentUserId?: string): CommentResponseModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
        likesInfo: CommentRepository.getLikesInfo(comment, currentUserId),
    };
};

export class CommentRepository {
    static async getComment(id: string, currentUserId?: string) {
        const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });

        if (!comment) {
            return;
        }

        return createCommentDto(comment, currentUserId);
    }

    static async updateComment(id: string, data: CommentCreateModel) {
        const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });

        if (!comment) {
            return;
        }

        await commentsCollection.updateOne(
            { _id: comment._id },
            {
                $set: {
                    content: data.content,
                },
            },
        );

        return CommentRepository.getComment(id, comment.commentatorInfo.userId);
    }

    static async deleteComment(id: string) {
        const post = await commentsCollection.findOne({ _id: new ObjectId(id) });

        if (!post) {
            return;
        }

        await commentsCollection.deleteOne({ _id: post._id });

        return { id };
    }

    static async deleteAll() {
        await commentsCollection.deleteMany({});

        return [];
    }

    static async createCommentByPost(postId: string, data: CommentCreateModel) {
        const comment = {
            postId,
            commentatorInfo: data.commentatorInfo,
            content: data.content,
            createdAt: new Date(),
        };

        const item = await commentsCollection.insertOne(comment);

        return CommentRepository.getComment(item.insertedId.toString());
    }

    static async getCommentsByPost(postId: string, params: GetCommentsByPostParams, currentUserId?: string) {
        const totalCount = await commentsCollection.count({ postId });
        const pageSize = params.pageSize || 10;
        const skip = params.pageNumber && pageSize ? (params.pageNumber - 1) * pageSize : 0;
        const comments = await commentsCollection
            .find({ postId })
            .sort({ [params.sortBy || 'createdAt']: params.sortDirection === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(pageSize || totalCount)
            .toArray();

        return {
            page: params.pageNumber || 1,
            pageSize: pageSize,
            pagesCount: Math.ceil(totalCount / pageSize),
            totalCount,
            items: comments.map((comment) => createCommentDto(comment, currentUserId)),
        };
    }

    static async likeComment(userId: string, commentId: string): Promise<boolean> {
        const comment = await commentsCollection.findOne({ _id: new ObjectId(commentId) });

        if (!comment) {
            return false;
        }

        const hasLike = comment.likedUsers?.includes(userId);
        const hasDislike = comment.dislikedUsers?.includes(userId);
        let likedUsers = comment.likedUsers || [];
        let dislikedUsers = comment.dislikedUsers || [];

        if (!hasLike) {
            likedUsers?.push(userId);
        }

        if (hasDislike) {
            dislikedUsers = dislikedUsers?.filter((item) => item !== userId);
        }

        await commentsCollection.updateOne(
            { _id: new ObjectId(commentId) },
            {
                $set: {
                    content: comment.content,
                    likedUsers,
                    dislikedUsers,
                },
            },
        );

        return true;
    }

    static async dislikeComment(userId: string, commentId: string): Promise<boolean> {
        const comment = await commentsCollection.findOne({ _id: new ObjectId(commentId) });

        if (!comment) {
            return false;
        }

        const hasLike = comment.likedUsers?.includes(userId);
        const hasDislike = comment.dislikedUsers?.includes(userId);
        let likedUsers = comment.likedUsers || [];
        let dislikedUsers = comment.dislikedUsers || [];

        if (hasDislike) {
            dislikedUsers = dislikedUsers?.filter((item) => item !== userId);
        } else {
            dislikedUsers?.push(userId);
        }

        if (hasLike) {
            likedUsers = likedUsers?.filter((item) => item !== userId);
        }

        await commentsCollection.updateOne(
            { _id: new ObjectId(commentId) },
            {
                $set: {
                    content: comment.content,
                    likedUsers,
                    dislikedUsers,
                },
            },
        );

        return true;
    }

    static async removeLikes(userId: string, commentId: string): Promise<boolean> {
        const comment = await commentsCollection.findOne({ _id: new ObjectId(commentId) });

        if (!comment) {
            return false;
        }

        await commentsCollection.updateOne(
            { _id: new ObjectId(commentId) },
            {
                $set: {
                    content: comment.content,
                    likedUsers: comment.likedUsers?.filter((item) => item !== userId),
                    dislikedUsers: comment.dislikedUsers?.filter((item) => item !== userId),
                },
            },
        );

        return true;
    }

    static getLikesInfo(comment: Comment, currentUserId?: string) {
        const likesInfo = { likesCount: 0, dislikesCount: 0, myStatus: LikeStatus.None };

        likesInfo.likesCount = comment.likedUsers?.length || 0;
        likesInfo.dislikesCount = comment.dislikedUsers?.length || 0;

        const hasLike = currentUserId && comment.likedUsers?.includes(currentUserId);
        const hasDislike = currentUserId && comment.dislikedUsers?.includes(currentUserId);

        if (hasLike) {
            likesInfo.myStatus = LikeStatus.Like;
        } else if (hasDislike) {
            likesInfo.myStatus = LikeStatus.Dislike;
        }

        return likesInfo;
    }
}
