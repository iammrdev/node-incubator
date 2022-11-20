import { BlogRepository } from '../blogs/blog.repository.js';
import { CommentRepository } from '../comments/comment.repository.js';
import { PostRepository } from '../posts/post.repository.js';
import { UserRepository } from '../users/user.repository.js';
import { VideoRepository } from '../videos/video.repository.js';

const deleteAllData = async () => {
    VideoRepository.deleteAll();
    BlogRepository.deleteAll();
    PostRepository.deleteAll();
    UserRepository.deleteAll();
    CommentRepository.deleteAll()
};

export const TestingService = {
    deleteAllData,
};
