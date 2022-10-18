import { BlogRepository } from '../blogs/blog.repository';
import { PostRepository } from '../posts/post.repository';
import { VideoRepository } from '../videos/video.repository';

const deleteAllData = async () => {
    VideoRepository.deleteAll();
    BlogRepository.deleteAll();
    PostRepository.deleteAll();
};

export const TestingService = {
    deleteAllData,
};
