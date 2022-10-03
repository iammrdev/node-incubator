import { ObjectId } from 'mongodb';
import { blogsCollection } from '../../lib/db';
import { Blog } from './blog.types';

export class BlogRepository {
    static async createBlog(data: Omit<Blog, 'id'>) {
        const blog = {
            name: data.name,
            youtubeUrl: data.youtubeUrl,
        };

        const item = await blogsCollection.insertOne(blog);

        return { item: { ...blog, id: item.insertedId } };
    }

    static async deleteBlog(id: string) {
        await blogsCollection.deleteOne({ _id: new ObjectId(id) });

        return { id };
    }

    static async deleteAll() {
        await blogsCollection.deleteMany({});

        return [];
    }

    static async getAll() {
        const blogs = await blogsCollection.find({});

        return blogs.toArray();
    }

    static async getBlog(id: string) {
        const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

        if (!blog) {
            return;
        }

        return { item: blog };
    }

    static async updateBlog(id: string, data: Blog) {
        const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

        if (!blog) {
            return;
        }

        const updated: Blog = {
            id,
            name: data.name,
            youtubeUrl: data.youtubeUrl,
        };

        await blogsCollection.updateOne({ _id: new ObjectId(id) }, updated);

        return { item: updated };
    }
}
