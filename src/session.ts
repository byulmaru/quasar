import Cookie from 'js-cookie';
import type { SessionData } from './type';
import { decodeJwt } from 'jose';

let sessionData: SessionData | null = null;

export function getSession() {
  if(!sessionData) {
    const cookie = Cookie.get('token');
    if(!cookie) {
      return null;
    }
    sessionData = decodeJwt(cookie) as SessionData;
  }
  return sessionData;
}