import Cookie from 'js-cookie';
import type { SessionData } from './type';

let sessionData: SessionData | null = null;

export function getSession() {
  if(!sessionData) {
    sessionData = JSON.parse(Cookie.get('token') || 'null') as SessionData | null;
  }
  return sessionData;
}