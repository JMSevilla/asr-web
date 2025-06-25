import jwt_decode, { JwtPayload } from 'jwt-decode';
import { logger } from '../../datadog-logs';

type AccessToken = JwtPayload & { token_id: string };
export type SingleAuthAccessToken = JwtPayload & {
  id_token: string;
  acr: string;
  sub: string,
  externalId?: string;
  targetUrl?: string;
  RegistrationCode?: string;
  userIdType?: string;
};

export function isValid(token: string) {
  const obj: AccessToken = jwt_decode(token);
  return obj.exp! * 1000 >= Date.now();
}

export function parseTokenId(token: string) {
  const obj: AccessToken = jwt_decode(token);
  return obj.token_id;
}

export function parseSingleAuthIdToken(token: string) {
  try {
    return jwt_decode<SingleAuthAccessToken>(token);
  } catch (error) {
    logger.error('Failed to parse single auth access token', error as object);
    throw new Error('Failed to parse single auth access token');
  }
}
