import { BlogRepository } from '../blogs/blog.repository';
import { CommentRepository } from '../comments/comment.repository';
import { PostRepository } from '../posts/post.repository';
import { UserRepository } from '../users/user.repository';
import { VideoRepository } from '../videos/video.repository';

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
