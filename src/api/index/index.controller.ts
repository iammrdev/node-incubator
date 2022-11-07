import { Request, Response } from 'express';

const health = async (_req: Request, res: Response) => {
    return res.send({ status: 'ok' });
};

export const IndexController = {
    health,
};
