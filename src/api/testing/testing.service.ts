import { VideoRepository } from '../videos/video.repository';

const deleteAllData = async () => {
    return VideoRepository.deleteAll();
};

export const TestingService = {
    deleteAllData,
};
