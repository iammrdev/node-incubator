import 'dotenv/config';
import express from 'express';
import { indexRouter } from './api/index/index.router';
import { blogRouter } from './api/blogs/blog.router';
import { testingRouter } from './api/testing/testing.router';
import { videoRouter } from './api/videos/video.router';
import { postRouter } from './api/posts/post.router';
import { userRouter } from './api/users/user.router';
import { authRouter } from './api/auth/auth.router';
import { commentRouter } from './api/comments/comment.router';
import { runDB } from './lib/db/index';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/testing', testingRouter);
app.use('/auth', authRouter);
app.use('/videos', videoRouter);
app.use('/blogs', blogRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/comments', commentRouter);
app.use('/', indexRouter);

const init = async () => {
    await runDB();

    app.listen(port, async () => {
        console.log(`Example app listening on port ${port}`);
    });
};

init();
