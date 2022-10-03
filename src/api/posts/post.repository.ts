import { ObjectId } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { postsCollection } from '../../lib/db';
import { BlogRepository } from '../blogs/blog.repository';
import { Post } from './post.types';

let posts: Post[] = [];

export class PostRepository {
    static async createPost(data: Omit<Post, 'id'>) {
        const post = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
        };

        const item = await postsCollection.insertOne(post);

        return { item: { ...post, id: item.insertedId } };
    }

    static async deletePost(id: string) {
        await postsCollection.deleteOne({ _id: new ObjectId(id) });

        return { id };
    }

    static async deleteAll() {
        await postsCollection.deleteMany({});

        return [];
    }

    static async getAll() {
        const posts = await postsCollection.find({});

        return posts.toArray();
    }

    static async getPost(id: string) {
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });

        if (!post) {
            return;
        }

        return { item: post };
    }

    static async updatePost(id: string, data: Post) {
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });

        if (!post) {
            return;
        }

        const updated: Post = {
            id,
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
        };

        await postsCollection.updateOne({ _id: new ObjectId(id) }, updated);

        return { item: updated };
    }
}
