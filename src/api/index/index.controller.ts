import { Request, Response } from 'express';
import { Mailer } from '../../lib/mailer';

const health = async (_req: Request, res: Response) => {
    return res.send({ status: 'ok' });
};

const email = async (_req: Request, res: Response) => {

    const info = await Mailer.send({
        email: '224box@mail.ru',
        subject: 'test',
        message: '<div>test</div>'
    })

    return res.send({
        status: "Message sent:v" + info.messageId,
        info
    });
};


export const IndexController = {
    health,
    email
};
