import { v4 as uuid } from 'uuid';
import { BlogRepository } from '../blogs/blog.repository';
import { Post } from './post.types';

let posts: Post[] = [];

export class PostRepository {
    static createPost(data: Omit<Post, 'id'>) {
        const post: Post = {
            id: uuid(),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
        };

        posts.push(post);

        return {
            item: {
                ...post,
                blogName: BlogRepository.getBlog(post.blogId)?.item.name,
            },
        };
    }

    static deletePost(id: string) {
        const post = posts.find((item) => item.id === id);

        if (!post) {
            return;
        }

        posts = posts.filter((item) => item.id !== id);

        return { id };
    }

    static deleteAll() {
        posts = [];

        return posts;
    }

    static getAll() {
        return posts.map((post) => ({
            ...post,
            blogName: BlogRepository.getBlog(post.blogId)?.item.name,
        }));
    }

    static getPost(id: string) {
        const post = posts.find((item) => item.id === id);

        if (!post) {
            return;
        }

        const blog = BlogRepository.getBlog(post.blogId);

        return { item: { ...post, blogName: blog?.item.name } };
    }

    static updatePost(id: string, data: Post) {
        const post = posts.find((item) => item.id === id);

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

        posts = posts.map((post) => (post.id === id ? updated : post));

        return {
            item: {
                ...post,
                blogName: BlogRepository.getBlog(post.blogId)?.item.name,
            },
        };
    }
}
