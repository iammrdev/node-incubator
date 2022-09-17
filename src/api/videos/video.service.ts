import { VideoRepository } from './video.repository';
import { Video } from './video.types';

const create = async (data: Omit<Video, 'id'>) => {
    return VideoRepository.createVideo(data);
};

const getAll = async () => {
    return VideoRepository.getVideos();
};

const updateById = async (id: number, data: Video) => {
    return VideoRepository.updateVideo(id, data);
};

const deleteById = async (id: number) => {
    return VideoRepository.deleteVideo(id);
};

const getById = async (id: number) => {
    return VideoRepository.getVideo(id);
};

export const VideoService = {
    create,
    getAll,
    updateById,
    deleteById,
    getById,
};
