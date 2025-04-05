import {
  loginOrSingUpWithGoogle,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  resetPassword,
  resetToken,
} from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import { setUpSession } from '../utils/setUpSession.js';

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

  setUpSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
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

export const resetTokenController = async (req, res) => {
  await resetToken(req.body.email);

  res.status(200).send({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    date: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.status(200).send({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export const getGoogleOAuthUrlController = (req, res) => {
  const url = generateAuthUrl();

  res.status(200).send({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSingUpWithGoogle(req.body.code);
  setUpSession(res, session);

  res.status(200).send({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};