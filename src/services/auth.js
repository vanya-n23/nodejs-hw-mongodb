import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';

import { UsersCollections } from '../db/models/user.js';
import { SessionsCollections } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import { SMTP } from '../constants/index.js';
import {
  getFullNameFromTokenGooglePayload,
  validateCode,
} from '../utils/googleOAuth2.js';
import { randomBytes } from 'node:crypto';

export const registerUser = async (payload) => {
  const user = await UsersCollections.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'this email use already');
  }

  const hashPassword = await bcrypt.hash(payload.password, 10);

  return UsersCollections.create({
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

  return await SessionsCollections.create({
    userId: user._id,
    ...createSession(),
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

export const resetToken = async (email) => {
  console.log('🚀 ~ resetToken ~ email:', email);
  const user = await UsersCollections.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const TEMPLATES_PATH = path.join(process.cwd(), 'src', 'templates');
  const readFile = (
    await fs.readFile(path.join(TEMPLATES_PATH, 'reset-password.hbs'))
  ).toString();

  const template = handlebars.compile(readFile);

  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'RESET YOUR PASSWORD',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));

    const user = await UsersCollections.findById(entries.sub);

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    await UsersCollections.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    await SessionsCollections.findByIdAndDelete(user._id);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createHttpError(401, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      throw createHttpError(401, 'Token is expired');
    }
    throw error;
  }
};

export const loginOrSingUpWithGoogle = async (code) => {
  const ticket = await validateCode(code);

  if (!ticket) throw createHttpError(401);

  let user = await UsersCollections.findOne({ email: ticket.payload.email });

  if (!user) {
    const password = await bcrypt.hash(randomBytes(10).toString('base64'), 10);

    user = await UsersCollections.create({
      email: ticket.payload.email,
      name: getFullNameFromTokenGooglePayload(ticket),
      password,
      role: 'parent',
    });
  }
  const session = createSession();

  await SessionsCollections.deleteOne({ userId: user._id });
  return await SessionsCollections.create({
    userId: user._id,
    ...session,
  });
};