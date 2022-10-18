import { DBRef, ObjectId, WithId } from 'mongodb';
import { blogsCollection, postsCollection } from '../../lib/db';
import { BlogRepository, getBlogDto } from '../blogs/blog.repository';
import { Blog } from '../blogs/blog.types';
import { GetPostsByBlogIdParams, Post } from './post.types';

const createPostDto = (post: WithId<Post>, blog?: Blog): Post => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: blog?.name || '',
        createdAt: post._id.getTimestamp(),
    };
};

export class PostRepository {
    static async createPost(data: Omit<Post, 'id'>) {
        const post = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
        };

        const item = await postsCollection.insertOne(post);

        return PostRepository.getPost(item.insertedId.toString());
    }

    static async createPostByBlog(blogId: string, data: Omit<Post, 'id'>) {
        const post = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
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

    static async getAll(params: GetPostsByBlogIdParams = { sortBy: 'title' }) {
        const totalCount = await postsCollection.count({})
        const pageSize = params.pageSize || 10;
        const skip = params.pageNumber && pageSize ? (params.pageNumber - 1) * pageSize : 0
        const posts = await postsCollection
            .find({})
            .sort({ [params.sortBy]: params.sortDirection === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(pageSize || totalCount).toArray();

        const blogs = await blogsCollection.find({}).toArray()


        return {
            page: params.pageNumber || 1,
            pageSize: pageSize,
            pagesCount: Math.ceil(totalCount / pageSize),
            totalCount,
            items: posts.map((post) =>
                createPostDto(
                    post,
                    blogs.map(getBlogDto).find((blog) => blog.id === post.blogId),
                ),
            )
        };
    }

    static async getAllByBlog(blogId: string, params: GetPostsByBlogIdParams) {
        const totalCount = await postsCollection.count({ blogId })
        const pageSize = params.pageSize || 10;
        const skip = params.pageNumber && pageSize ? (params.pageNumber - 1) * pageSize : 0
        const posts = await postsCollection
            .find({ blogId })
            .sort({ [params.sortBy]: params.sortDirection === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(pageSize || totalCount).toArray();

        const blogs = await blogsCollection.find({}).toArray()

        return {
            page: params.pageNumber || 1,
            pageSize: pageSize,
            pagesCount: Math.ceil(totalCount / pageSize),
            totalCount,
            items: posts.map((post) =>
                createPostDto(
                    post,
                    blogs.map(getBlogDto).find((blog) => blog.id === blogId),
                ),
            )
        };
    }


    static async getPost(id: string) {
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });

        if (!post) {
            return;
        }

        const blog = await BlogRepository.getBlog(post.blogId.toString());

        return createPostDto(post, blog);
    }

    static async updatePost(id: string, data: Post) {
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });

        if (!post) {
            return;
        }

        const updated: Post = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
        };

        await postsCollection.updateOne({ _id: post._id }, { $set: updated });

        return PostRepository.getPost(id);
    }
}
