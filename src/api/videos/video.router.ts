import { Router } from 'express';
import { VideoController } from './video.controller.js';

const videoRouter = Router();

videoRouter.route('/').get(VideoController.getVideos).post(VideoController.createVideo);
videoRouter.route('/:id').get(VideoController.getVideo).put(VideoController.updateVideo).delete(VideoController.deleteVideo);

export { videoRouter };
