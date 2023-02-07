import { MongoClient } from 'mongodb';
import { RefreshToken } from '../../api/auth/auth.types';
import { Blog } from '../../api/blogs/blog.types';
import { Comment } from '../../api/comments/comment.types';
import { Post } from '../../api/posts/post.types';
import { User } from '../../api/users/user.types';
import { Video } from '../../api/videos/video.types';

const mongoURI =
    process.env.mongoURI || 'mongodb+srv://admin:test@cluster0.6fqjtpg.mongodb.net/?retryWrites=true&w=majority';

export const client = new MongoClient(mongoURI);

const db = client.db('basic-backend');

export const videosCollection = db.collection<Video>('videos');
export const blogsCollection = db.collection<Blog>('blogs');
export const postsCollection = db.collection<Post>('posts');
export const usersCollection = db.collection<User>('users');
export const commentsCollection = db.collection<Comment>('comments');
export const tokensCollection = db.collection<RefreshToken>('tokens');

export const runDB = async () => {
    try {
        await client.connect();
        // await client.db("videos").command({ ping: 1 })

        console.log('Connected successfully to mongo server');
    } catch (error) {
        await client.close();
    }
};
