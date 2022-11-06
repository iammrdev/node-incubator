import 'dotenv/config';
import express from 'express';
import blogRouter from './api/blogs/blog.router.js';
import testingRouter from './api/testing/testing.router.js';
import videoRouter from './api/videos/video.router.js';
import postRouter from './api/posts/post.router.js';
import userRouter from './api/users/user.router.js';
import authRouter from './api/auth/auth.router.js';
import { runDB } from './lib/db/index.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/testing', testingRouter);
app.use('/videos', videoRouter);
app.use('/blog', blogRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

const init = async () => {
    await runDB();

    app.listen(port, async () => {
        console.log(`Example app listening on port ${port}`);
    });
};

init();
