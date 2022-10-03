import { ObjectId, WithId } from 'mongodb';
import { videosCollection } from '../../lib/db';
import { Video } from './video.types';

const createVideoDto = (video: WithId<Video>): Video => {
    return {
        id: video._id.toString(),
        title: video.title,
        author: video.author,
        canBeDownloaded: video.canBeDownloaded ?? false,
        minAgeRestriction: video.minAgeRestriction || null,
        publicationDate: video.publicationDate,
        availableResolutions: video.availableResolutions || [],
        createdAt: video._id.getTimestamp(),
    };
};

export class VideoRepository {
    static async createVideo(data: Omit<Video, 'id'>) {
        const publicationDate = new Date();
        publicationDate.setDate(publicationDate.getDate() + 1);

        const video: Video = {
            title: data.title,
            author: data.author,
            canBeDownloaded: data.canBeDownloaded ?? false,
            minAgeRestriction: data.minAgeRestriction || null,
            publicationDate,
            availableResolutions: data.availableResolutions || [],
        };

        const item = await videosCollection.insertOne(video);

        return VideoRepository.getVideo(item.insertedId.toString());
    }

    static async deleteVideo(id: string) {
        const video = await videosCollection.findOne({ _id: new ObjectId(id) });

        if (!video) {
            return;
        }

        await videosCollection.deleteOne({ _id: video._id });

        return { id };
    }

    static async deleteAll() {
        await videosCollection.deleteMany({});

        return [];
    }

    static async getVideos(): Promise<Video[]> {
        const videos = await videosCollection.find({});

        return videos.map(createVideoDto).toArray();
    }

    static async getVideo(id: string) {
        const video = await videosCollection.findOne({ _id: new ObjectId(id) });

        if (!video) {
            return;
        }

        return createVideoDto(video);
    }

    static async updateVideo(id: string, data: Video) {
        const video = await videosCollection.findOne({ _id: new ObjectId(id) });

        if (!video) {
            return;
        }

        const updated = {
            title: data.title,
            author: data.author,
            canBeDownloaded: data.canBeDownloaded,
            minAgeRestriction: data.minAgeRestriction,
            publicationDate: data.publicationDate,
            availableResolutions: data.availableResolutions,
        };

        await videosCollection.updateOne({ _id: video._id }, { $set: updated });

        return VideoRepository.getVideo(id);
    }
}
