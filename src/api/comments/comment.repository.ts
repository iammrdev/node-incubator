import { ObjectId, WithId } from 'mongodb';
import { commentsCollection } from '../../lib/db/index';
import { UserRepository } from '../users/user.repository';
import { UserResponseModel } from '../users/user.types';
import { Comment, CommentCreateModel, CommentResponseModel, GetCommentsByPostParams } from './comment.types';

const createCommentDto = (comment: WithId<Comment>, user?: UserResponseModel): CommentResponseModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        userId: comment.userId,
        userLogin: user?.login || '',
        createdAt: comment.createdAt,
    };
};

export class CommentRepository {
    static async getComment(id: string) {
        const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });

        if (!comment) {
            return;
        }

        const user = await UserRepository.getUser(comment.userId.toString());

        return createCommentDto(comment, user);
    }

    static async updateComment(id: string, data: CommentCreateModel) {
        const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });

        if (!comment) {
            return;
        }

        await commentsCollection.updateOne({ _id: comment._id }, {
            $set: {
                userId: comment.userId,
                content: data.content
            }
        });

        return CommentRepository.getComment(id);
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
            userId: data.userId,
            content: data.content,
            createdAt: new Date(),
        };

        const item = await commentsCollection.insertOne(comment);

        return CommentRepository.getComment(item.insertedId.toString());
    }

    static async getCommentsByPost(postId: string, params: GetCommentsByPostParams) {
        const totalCount = await commentsCollection.count({ postId });
        const pageSize = params.pageSize || 10;
        const skip = params.pageNumber && pageSize ? (params.pageNumber - 1) * pageSize : 0;
        const comments = await commentsCollection
            .find({ postId })
            .sort({ [params.sortBy || 'createdAt']: params.sortDirection === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(pageSize || totalCount)
            .toArray();

        const users = await UserRepository.getAll();

        return {
            page: params.pageNumber || 1,
            pageSize: pageSize,
            pagesCount: Math.ceil(totalCount / pageSize),
            totalCount,
            items: comments.map((comment) =>
                createCommentDto(
                    comment,
                    users.items.find((user) => user.id === comment.userId),
                ),
            ),
        };
    }

}
