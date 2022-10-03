import { ObjectId } from 'mongodb';
import { client, videosCollection } from '../../lib/db';
import { Video } from './video.types';

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

        return { item: { ...video, id: item.insertedId } };
    }

    static async deleteVideo(id: string) {
        await videosCollection.deleteOne({ _id: new ObjectId(id) });

        return { id };
    }

    static async deleteAll() {
        await videosCollection.deleteMany({});

        return [];
    }

    static async getVideos(): Promise<Video[]> {
        const videos = await videosCollection.find({});

        return videos.toArray();
    }

    static async getVideo(id: string) {
        const video = await videosCollection.findOne({ _id: new ObjectId(id) });

        if (!video) {
            return;
        }

        return { item: video };
    }

    static async updateVideo(id: string, data: Video) {
        const video = await videosCollection.findOne({ _id: new ObjectId(id) });

        if (!video) {
            return;
        }

        const updated: Video = {
            title: data.title,
            author: data.author,
            canBeDownloaded: data.canBeDownloaded,
            minAgeRestriction: data.minAgeRestriction,
            publicationDate: data.publicationDate,
            availableResolutions: data.availableResolutions,
        };

        await videosCollection.updateOne({ _id: new ObjectId(id) }, updated);

        return { item: updated };
    }
}
