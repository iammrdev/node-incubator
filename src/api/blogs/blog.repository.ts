import { ObjectId, WithId } from 'mongodb';
import { blogsCollection } from '../../lib/db';
import { Blog } from './blog.types';

const createBlogDto = (blog: WithId<Blog>): Blog => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        youtubeUrl: blog.youtubeUrl,
        createdAt: blog._id.getTimestamp(),
    };
};

export class BlogRepository {
    static async createBlog(data: Omit<Blog, 'id'>) {
        const blog = {
            name: data.name,
            youtubeUrl: data.youtubeUrl,
        };

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

    static async getAll() {
        const blogs = await blogsCollection.find({});

        return blogs.map(createBlogDto).toArray();
    }

    static async getBlog(id: string) {
        const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

        if (!blog) {
            return;
        }

        return createBlogDto(blog);
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
