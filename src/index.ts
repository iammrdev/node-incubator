import express from 'express';
import blogRouter from './api/blogs/blog.router';
import testingRouter from './api/testing/testing.router';
import videoRouter from './api/videos/video.router';
import postRouter from './api/posts/post.router';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/testing', testingRouter);
app.use('/videos', videoRouter);
app.use('/blogs', blogRouter);
app.use('/posts', postRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
