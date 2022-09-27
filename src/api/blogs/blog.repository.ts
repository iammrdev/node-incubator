import { v4 as uuid } from 'uuid';
import { Blog } from './blog.types';

let blogs: Blog[] = [];

export class BlogRepository {
    static createBlog(data: Omit<Blog, 'id'>) {
        const blog: Blog = {
            id: uuid(),
            name: data.name,
            youtubeUrl: data.youtubeUrl,
        };

        blogs.push(blog);

        return { item: blog };
    }

    static deleteBlog(id: string) {
        const blog = blogs.find((item) => item.id === id);

        if (!blog) {
            return;
        }

        blogs = blogs.filter((item) => item.id !== id);

        return { id };
    }

    static deleteAll() {
        blogs = [];

        return blogs;
    }

    static getAll() {
        return blogs;
    }

    static getBlog(id: string) {
        const blog = blogs.find((item) => item.id === id);

        if (!blog) {
            return;
        }

        return { item: blog };
    }

    static updateBlog(id: string, data: Blog) {
        const blog = blogs.find((item) => item.id === id);

        if (!blog) {
            return;
        }

        const updated: Blog = {
            id,
            name: data.name,
            youtubeUrl: data.youtubeUrl,
        };

        blogs = blogs.map((blog) => (blog.id === id ? updated : blog));

        return { item: blog };
    }
}
