import { ObjectId, WithId } from 'mongodb';
import { blogsCollection } from '../../lib/db/index.js';
import { GetPostsByBlogIdParams } from '../posts/post.types.js';
import { Blog } from './blog.types.js';

export const getBlogDto = (blog: WithId<Blog>): Blog => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        youtubeUrl: blog.youtubeUrl,
        createdAt: blog.createdAt,
    };
};

export class BlogRepository {
    static async createBlog(blog: Omit<Blog, 'id'>) {
        const item = await blogsCollection.insertOne({ ...blog, createdAt: new Date() });

        return BlogRepository.getBlog(item.insertedId.toString());
    }

    static async deleteBlog(id: string) {
        const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

        if (!blog) {
            return;
        }

        await blogsCollection.deleteOne({ _id: blog._id });

        return { id };
    }

    static async deleteAll() {
        await blogsCollection.deleteMany({});

        return [];
    }

    static async getAll(params: GetPostsByBlogIdParams = { sortBy: 'createdAt' }) {
        const totalCount = await blogsCollection.count({ name: { $regex: params.searchNameTerm, $options: '$i' } });
        const pageSize = params.pageSize || 10;
        const skip = params.pageNumber && pageSize ? (params.pageNumber - 1) * pageSize : 0;
        const blogs = await blogsCollection
            .find({ name: { $regex: params.searchNameTerm, $options: '$i' } })
            .sort({ [params.sortBy || 'createdAt']: params.sortDirection === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(pageSize || totalCount)
            .toArray();

        return {
            pagesCount: pageSize ? Math.ceil(totalCount / pageSize) : 1,
            page: params.pageNumber || 1,
            pageSize: pageSize || totalCount,
            totalCount,
            items: blogs.map(getBlogDto),
        };
    }

    static async getBlog(id: string) {
        const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

        if (!blog) {
            return;
        }

        return getBlogDto(blog);
    }

    static async updateBlog(id: string, data: Blog) {
        const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

        if (!blog) {
            return;
        }

        const updated = {
            name: data.name,
            youtubeUrl: data.youtubeUrl,
        };

        await blogsCollection.updateOne({ _id: blog._id }, { $set: updated });

        return BlogRepository.getBlog(id);
    }
}
