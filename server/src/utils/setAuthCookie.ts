import { Response } from 'express';
import config from '../config';

/**
 * Set the authentication cookie (accessToken) on the response.
 *
 * The cookie is httpOnly and uses secure/cross-site settings that adapt to
 * the environment: `secure` + `sameSite: 'none'` in production (required for
 * cross-site cookies), and a relaxed `sameSite: 'lax'` for local development.
 */
export const setAuthCookie = (res: Response, token: string) => {
  const isProduction = config.NODE_ENV === 'production';
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  });
};
