import express, { Request, Response } from "express";
const app = express();
const port = process.env.PORT || 3000;

const videos = [{
  "id": 0,
  "title": "string",
  "author": "string",
  "canBeDownloaded": true,
  "minAgeRestriction": null,
  "createdAt": "2022-09-17T16:09:46.178Z",
  "publicationDate": "2022-09-17T16:09:46.178Z",
  "availableResolutions": [
    "P144"
  ]
}]

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!!!");
});

app.get("/videos", (_req: Request, res: Response) => {
  res.send(videos);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

