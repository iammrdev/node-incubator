import { Post } from './post.types';

let id: number = 0;
let posts: Post[] = [];

export class PostRepository {
    static createPost(data: Omit<Post, 'id'>) {
        const post: Post = {
            id: ++id,
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
        };

        posts.push(post);

        return { item: post };
    }

    static deletePost(id: number) {
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
        return posts;
    }

    static getPost(id: number) {
        const post = posts.find((item) => item.id === id);

        if (!post) {
            return;
        }

        return { item: post };
    }

    static updatePost(id: number, data: Post) {
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

        return { item: post };
    }
}
