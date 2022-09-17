import { Video } from './video.types';

let id: number = 0;
let videos: Video[] = [];

export class VideoRepository {
    static createVideo(data: Omit<Video, 'id'>) {
        const publicationDate = new Date();
        publicationDate.setDate(publicationDate.getDate() + 1);

        const video: Video = {
            id: ++id,
            title: data.title,
            author: data.author,
            canBeDownloaded: data.canBeDownloaded ?? false,
            minAgeRestriction: data.minAgeRestriction || null,
            createdAt: new Date(),
            publicationDate,
            availableResolutions: data.availableResolutions || [],
        };

        videos.push(video);

        return { item: video };
    }

    static deleteVideo(id: number) {
        const video = videos.find((item) => item.id === id);

        if (!video) {
            return;
        }

        videos = videos.filter((item) => item.id !== id);

        return { id };
    }

    static deleteAll() {
        videos = [];

        return videos;
    }

    static getVideos() {
        return videos;
    }

    static getVideo(id: number) {
        const video = videos.find((item) => item.id === id);

        if (!video) {
            return;
        }

        return { item: video };
    }

    static updateVideo(id: number, data: Video) {
        const video = videos.find((item) => item.id === id);

        if (!video) {
            return;
        }

        const updated: Video = {
            id,
            title: data.title,
            author: data.author,
            canBeDownloaded: data.canBeDownloaded,
            minAgeRestriction: data.minAgeRestriction,
            createdAt: video.createdAt,
            publicationDate: data.publicationDate,
            availableResolutions: data.availableResolutions,
        };

        videos = videos.map((video) => (video.id === id ? updated : video));

        return { item: video };
    }
}
