import { BlogRepository } from '../blogs/blog.repository.js';
import { PostRepository } from '../posts/post.repository.js';
import { VideoRepository } from '../videos/video.repository.js';

const deleteAllData = async () => {
    VideoRepository.deleteAll();
    BlogRepository.deleteAll();
    PostRepository.deleteAll();
};

export const TestingService = {
    deleteAllData,
};
