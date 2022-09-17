import express, { Request, Response } from 'express';

let id = 2;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

interface Video {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: Date;
    publicationDate: Date;
    availableResolutions: string[];
}

let videos: Video[] = [
    {
        id: 1,
        title: 'string',
        author: 'string',
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date(),
        publicationDate: new Date(),
        availableResolutions: ['P144'],
    },
];

app.get('/', (_req: Request, res: Response) => {
    res.send('Hello World!!!');
});

app.delete('/testing/all-data', (_req: Request, res: Response) => {
    videos = [];

    res.sendStatus(204);
});

app.get('/videos', (_req: Request, res: Response) => {
    res.send(videos);
});

app.post('/videos', (req: Request, res: Response) => {
    const data = req.body;

    const video: Video = {
        id: id++,
        title: data.title,
        author: data.author,
        canBeDownloaded: data.canBeDownloaded || false,
        minAgeRestriction: data.minAgeRestriction || null,
        createdAt: new Date(),
        publicationDate: new Date(),
        availableResolutions: data.availableResolutions || [],
    };

    videos.push(video);

    res.status(201).send(video);
});

app.get('/videos/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const video = videos.find((item) => item.id === id);

    if (!video) {
        res.sendStatus(404);
        return;
    }

    res.send(video);
});

app.put('/videos', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = req.body;

    const video = videos.find((item) => item.id === id);

    if (!video) {
        res.sendStatus(404);
        return;
    }

    const updated: Video = {
        id,
        title: data.title,
        author: data.author,
        canBeDownloaded: data.canBeDownloaded,
        minAgeRestriction: data.minAgeRestriction,
        createdAt: video.createdAt,
        publicationDate: new Date(),
        availableResolutions: data.availableResolutions,
    };

    videos = videos.map((video) => (video.id === id ? updated : video));

    res.sendStatus(204);
});

app.delete('/videos/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const index = videos.findIndex((item) => item.id === id);

    if (index === -1) {
        res.sendStatus(404);
        return;
    }

    videos.splice(index, 1);

    res.sendStatus(204);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
