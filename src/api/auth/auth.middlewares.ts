import auth from 'express-basic-auth';

export const basicAuth = auth({
    users: { admin: 'qwerty' },
});
