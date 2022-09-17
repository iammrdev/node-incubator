import { Router } from 'express';
import { VideoController } from './video.controller';

const router = Router();

router.route('/').get(VideoController.getVideos).post(VideoController.createVideo);
router.route('/:id').get(VideoController.getVideo).put(VideoController.updateVideo).delete(VideoController.deleteVideo);

export default router;
