import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { ObjectId, WithId } from 'mongodb';
import { blogsCollection, postsCollection } from '../../lib/db/index';
import { BlogRepository, getBlogDto } from '../blogs/blog.repository';
import { Blog } from '../blogs/blog.types';
import { LikeStatus } from '../comments/comment.repository';
import { UserResponseModel } from '../users/user.types';
import { GetPostsByBlogIdParams, Post, PostResponseModel } from './post.types';

const createPostDto = (post: WithId<Post>, blog?: Blog, currentUserId?: string): PostResponseModel => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: blog?.name || '',
        createdAt: post.createdAt,
        extendedLikesInfo: PostRepository.getExtendedLikesInfo(post, currentUserId),
    };
};

export class PostRepository {
    static async createPost(data: Omit<Post, 'id'>) {
        const post = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            createdAt: new Date(),
        };

        const item = await postsCollection.insertOne(post);

        return PostRepository.getPost(item.insertedId.toString());
    }

    static async createPostByBlog(blogId: string, data: Omit<Post, 'id'>) {
        const post = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            createdAt: new Date(),
            blogId,
        };

        const item = await postsCollection.insertOne(post);

        return PostRepository.getPost(item.insertedId.toString());
    }

    static async deletePost(id: string) {
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });

        if (!post) {
            return;
        }

        await postsCollection.deleteOne({ _id: post._id });

        return { id };
    }

    static async deleteAll() {
        await postsCollection.deleteMany({});

        return [];
    }

    static async getAll(params: GetPostsByBlogIdParams = { sortBy: 'createdAt' }, currentUserId?: string) {
        const totalCount = await postsCollection.count({});
        const pageSize = params.pageSize || 10;
        const skip = params.pageNumber && pageSize ? (params.pageNumber - 1) * pageSize : 0;
        const posts = await postsCollection.find({}).toArray();
        const blogs = await blogsCollection.find({}).toArray();

        return {
            pagesCount: pageSize ? Math.ceil(totalCount / pageSize) : 1,
            page: params.pageNumber || 1,
            pageSize: pageSize || totalCount,
            totalCount,
            items: posts
                .map((post) =>
                    createPostDto(
                        post,
                        blogs.map(getBlogDto).find((blog) => blog.id === post.blogId),
                        currentUserId,
                    ),
                )
                .sort((post1: Post, post2: Post) => {
                    const sort = params.sortBy || ('createdAt' as keyof Post);

                    if (params.sortDirection === 'asc') {
                        // @ts-ignore
                        if (post1[sort] > post2[sort]) {
                            return 1;
                            // @ts-ignore
                        } else if (post1[sort] < post2[sort]) {
                            return -1;
                        }

                        return 0;
                    }
                    // @ts-ignore
                    if (post2[sort] > post1[sort]) {
                        return 1;
                        // @ts-ignore
                    } else if (post2[sort] < post1[sort]) {
                        return -1;
                    }

                    return 0;
                })
                .slice(skip, skip + pageSize || totalCount),
        };
    }

    static async getAllByBlog(blogId: string, params: GetPostsByBlogIdParams, currentUserId?: string) {
        const totalCount = await postsCollection.count({ blogId });
        const pageSize = params.pageSize || 10;
        const skip = params.pageNumber && pageSize ? (params.pageNumber - 1) * pageSize : 0;
        const posts = await postsCollection
            .find({ blogId })
            .sort({ [params.sortBy || 'createdAt']: params.sortDirection === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(pageSize || totalCount)
            .toArray();

        const blogs = await blogsCollection.find({}).toArray();

        return {
            page: params.pageNumber || 1,
            pageSize: pageSize,
            pagesCount: Math.ceil(totalCount / pageSize),
            totalCount,
            items: posts.map((post) =>
                createPostDto(
                    post,
                    blogs.map(getBlogDto).find((blog) => blog.id === blogId),
                    currentUserId,
                ),
            ),
        };
    }

    static async getPost(id: string, currentUserId?: string) {
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });

        if (!post) {
            return;
        }

        const blog = await BlogRepository.getBlog(post.blogId.toString());

        return createPostDto(post, blog, currentUserId);
    }

    static async updatePost(id: string, data: Post) {
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });

        if (!post) {
            return;
        }

        const updated = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
        };

        await postsCollection.updateOne({ _id: post._id }, { $set: updated });

        return PostRepository.getPost(id);
    }

    static async likeComment(user: UserResponseModel, postId: string): Promise<boolean> {
        const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return false;
        }

        const hasLike = post.likedUsers?.some((like) => like.userId === user.id);
        const hasDislike = post.dislikedUsers?.some((like) => like.userId === user.id);
        let likedUsers = post.likedUsers || [];
        let dislikedUsers = post.dislikedUsers || [];

        if (!hasLike) {
            likedUsers?.push({
                userId: user.id,
                login: user.login,
                addedAt: new Date(),
            });
        }

        if (hasDislike) {
            dislikedUsers = dislikedUsers?.filter((item) => item.userId !== user.id);
        }

        await postsCollection.updateOne(
            { _id: new ObjectId(postId) },
            {
                $set: {
                    likedUsers,
                    dislikedUsers,
                },
            },
        );

        return true;
    }

    static async dislikeComment(user: UserResponseModel, postId: string): Promise<boolean> {
        const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return false;
        }
        const hasLike = post.likedUsers?.some((like) => like.userId === user.id);
        const hasDislike = post.dislikedUsers?.some((like) => like.userId === user.id);
        let likedUsers = post.likedUsers || [];
        let dislikedUsers = post.dislikedUsers || [];

        if (hasDislike) {
            dislikedUsers = dislikedUsers?.filter((item) => item.userId !== user.id);
        } else {
            dislikedUsers?.push({
                userId: user.id,
                login: user.login,
                addedAt: new Date(),
            });
        }

        if (hasLike) {
            likedUsers = likedUsers?.filter((item) => item.userId !== user.id);
        }

        await postsCollection.updateOne(
            { _id: new ObjectId(postId) },
            {
                $set: {
                    likedUsers,
                    dislikedUsers,
                },
            },
        );

        return true;
    }

    static async removeLikes(user: UserResponseModel, postId: string): Promise<boolean> {
        const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return false;
        }

        await postsCollection.updateOne(
            { _id: new ObjectId(postId) },
            {
                $set: {
                    likedUsers: post.likedUsers?.filter((item) => item.userId !== user.id),
                    dislikedUsers: post.dislikedUsers?.filter((item) => item.userId !== user.id),
                },
            },
        );

        return true;
    }

    static getExtendedLikesInfo(post: Post, currentUserId?: string) {
        const extendedLikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeStatus.None,
            newestLikes:
                post.likedUsers
                    ?.sort((like1, like2) => {
                        // @ts-ignore
                        if (like2.addedAt > like1.addedAt) {
                            return 1;
                            // @ts-ignore
                        } else if (like2.addedAt < like1.addedAt) {
                            return -1;
                        }

                        return 0;
                    })
                    .slice(0, 3)
                    .map((item) => ({ ...item, addedAt: format(item.addedAt, 'dd.MM.yyyy') })) || [],
        };

        extendedLikesInfo.likesCount = post.likedUsers?.length || 0;
        extendedLikesInfo.dislikesCount = post.dislikedUsers?.length || 0;

        const hasLike = post.likedUsers?.some((like) => like.userId === currentUserId);
        const hasDislike = post.dislikedUsers?.some((like) => like.userId === currentUserId);

        if (hasLike) {
            extendedLikesInfo.myStatus = LikeStatus.Like;
        } else if (hasDislike) {
            extendedLikesInfo.myStatus = LikeStatus.Dislike;
        }

        return extendedLikesInfo;
    }
}
