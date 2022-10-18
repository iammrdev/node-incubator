import { ObjectId, WithId } from 'mongodb';
import { title } from 'process';
import { blogsCollection } from '../../lib/db';
import { GetPostsByBlogIdParams } from '../posts/post.types';
import { Blog } from './blog.types';

export const getBlogDto = (blog: WithId<Blog>): Blog => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        youtubeUrl: blog.youtubeUrl,
        createdAt: blog._id.getTimestamp(),
    };
};

export class BlogRepository {
    static async createBlog(blog: Omit<Blog, 'id'>) {
        const item = await blogsCollection.insertOne(blog);

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

    static async getAll(params: GetPostsByBlogIdParams = { sortBy: 'title' }) {
        const totalCount = await blogsCollection.count({})
        const pageSize = params.pageSize || 10;
        const skip = params.pageNumber && pageSize ? (params.pageNumber - 1) * pageSize : 0
        const blogs = await blogsCollection
            .find({})
            .sort({ [params.sortBy]: params.sortDirection === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(pageSize || totalCount).toArray();

        return {
            page: params.pageNumber || 1,
            pageSize: pageSize || totalCount,
            pagesCount: pageSize ? Math.ceil(totalCount / pageSize) : 1,
            totalCount,
            items: blogs.map(getBlogDto)
        }
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
