import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { VideoService } from './video.service';
import { Video } from './video.types';
import { VideoValidator } from './video.validator';

const getVideos = async (_req: Request, res: Response) => {
    const videos = await VideoService.getAll();

    return res.status(StatusCodes.OK).send(videos);
};

const getVideo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const result = await VideoService.getById(id);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).send(result.item);
};

const deleteVideo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const result = await VideoService.deleteById(id);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

const createVideo = async (req: Request, res: Response) => {
    const data: Omit<Video, 'id'> = req.body;

    const errors = VideoValidator.validateData(data);

    if (errors.length) {
        return res.status(StatusCodes.BAD_REQUEST).send({ errorsMessages: errors });
    }

    const result = await VideoService.create(data);

    return res.status(StatusCodes.CREATED).send(result.item);
};

const updateVideo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data: Video = req.body;

    const errors = VideoValidator.validateData(data);

    if (errors.length) {
        return res.status(StatusCodes.BAD_REQUEST).send({ errorsMessages: errors });
    }

    const result = await VideoService.updateById(id, data);

    if (!result) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
};

export const VideoController = {
    getVideos,
    getVideo,
    deleteVideo,
    updateVideo,
    createVideo,
};
