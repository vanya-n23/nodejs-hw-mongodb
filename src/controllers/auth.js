import { ONE_MOUNTH } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from '../services/auth.js';

const options = {
  httpOnly: true,
  expires: new Date(Date.now() + ONE_MOUNTH),
};

export const registerUserController = async (req, res) => {
  console.log(req.body);

  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, options);
  res.cookie('sessionId', session._id, options);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

const setUpSession = (res, session) => {
  res.cookie('sessionId', session._id, options);
  res.cookie('refreshToken', session.refreshToken, options);
};

export const refreshSessionController = async (req, res) => {
  const session = await refreshSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  setUpSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
  res.status(204).send();
};
