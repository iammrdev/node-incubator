import { MongoClient } from 'mongodb';
import { Blog } from '../../api/blogs/blog.types';
import { Post } from '../../api/posts/post.types';
import { Video } from '../../api/videos/video.types';

const mongoURI =
    process.env.mongoURI || 'mongodb+srv://admin:passwordistooweak@cluster0.vwye1ro.mongodb.net/basic-backend';

export const client = new MongoClient(mongoURI);

const db = client.db('basic-backend');

export const videosCollection = db.collection<Video>('videos');
export const blogsCollection = db.collection<Blog>('blogs');
export const postsCollection = db.collection<Post>('posts');

export const runDB = async () => {
    try {
        await client.connect();
        // await client.db("videos").command({ping: 1})

        console.log('Connected successfully to mongo server');
    } catch (error) {
        await client.close();
    }
};
