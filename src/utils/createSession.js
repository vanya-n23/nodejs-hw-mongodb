import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, ONE_MOUNTH } from '../constants/index.js';

export const createSession = () => {
  return {
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: Date.now() + FIFTEEN_MINUTES,
    refreshTokenValidUntil: Date.now() + ONE_MOUNTH,
  };
};
