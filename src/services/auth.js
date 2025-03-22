import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import { UsersCollections } from '../db/models/user.js';
import { SessionsCollections } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';

export const registerUser = async (payload) => {
  const user = await UsersCollections.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'this email use already');
  }

  const hashPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollections.create({
    ...payload,
    password: hashPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollections.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, 'incorrect email or password');
  }
  const isEqual = bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'incorrect email or password');
  }

  await SessionsCollections.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await SessionsCollections.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollections.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401);
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionsCollections.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollections.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  return await SessionsCollections.deleteOne({ _id: sessionId });
};
