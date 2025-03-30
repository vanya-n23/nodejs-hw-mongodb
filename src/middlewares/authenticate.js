import createHttpError from 'http-errors';
import { SessionsCollections } from '../db/models/session.js';
import { UsersCollections } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    next(createHttpError(401, 'Будь-ласка передайте заголовок'));
    return;
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    next(
      createHttpError(401, 'Заголовок авторизації повинен бути типу Bearer'),
    );
    return;
  }

  const session = await SessionsCollections.findOne({ accessToken: token });

  if (!session) {
    next(createHttpError(401, 'Сесію не знайдено'));
    return;
  }

  if (session.accessTokenValidUntil < new Date()) {
    next(createHttpError(401, 'AccessToken is expired'));
  }

  const user = await UsersCollections.findById(session.userId);

  if (!user) {
    next(createHttpError(401, 'User not found'));
    return;
  }

  req.user = user;

  next();
};
