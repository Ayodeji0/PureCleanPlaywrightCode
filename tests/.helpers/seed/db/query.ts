import 'dotenv/config';
import { randomBytes, createHash } from 'crypto';

import { client } from './client';
import { PORTAL_TYPE } from '../../types';

const BASE_URL = process.env.BASE_URL;
const AUTH_CALLBACK = `${BASE_URL}/api/auth/callback`;
const APP_URL = `${BASE_URL}/app`;
const HASH_SECRET = process.env.HASH_SECRET;

function generateToken() {
  return randomBytes(32).toString('hex');
}
function hashToken(token: string) {
  return createHash('sha256').update(`${token}${HASH_SECRET}`).digest('hex');
}

/**
 * Because we can't get the token in the email
 * use unique emails for testing to avoid duplicate tokens per user
 */
const getToken = async (email: string, portal: PORTAL_TYPE) => {
  const token = generateToken();
  await client.verificationToken.updateMany({
    data: { token: hashToken(token) },
    where: { identifier: email, portal },
  });

  return token;
};

export const getLoginLink = async (email: string) => {
  const portal = PORTAL_TYPE.Public;
  const token = await getToken(email, portal);
  if (!token) {
    throw new Error('Token not found');
  }

  const callbackUrl = `callbackUrl=${encodeURIComponent(APP_URL)}`;
  const tokenQS = `token=${encodeURIComponent(token)}`;
  const emailQS = `email=${encodeURIComponent(email)}`;
  const qs = `${callbackUrl}&${tokenQS}&${emailQS}`;
  return `${AUTH_CALLBACK}/EMAIL_LOGIN?${qs}`;
};

export const getSignupLink = async (email: string) => {
  const portal = PORTAL_TYPE.Public;
  const token = await getToken(email, portal);
  if (!token) {
    throw new Error('Token not found');
  }

  const callbackUrl = `callbackUrl=${encodeURIComponent(APP_URL)}`;
  const tokenQS = `token=${encodeURIComponent(token)}`;
  const emailQS = `email=${encodeURIComponent(email)}`;
  const qs = `${callbackUrl}&${tokenQS}&${emailQS}`;
  return `${AUTH_CALLBACK}/EMAIL_SIGNUP?${qs}`;
};

/**
 * NOTE: Users can have multiple invitations from different workspaces
 * on the same email, but can only accept one. To avoid having to specify
 * which workspace's invite we are looking for ine this query,
 * use unique emails for invites.
 *
 * Where possible, all test cases that require signup/login/invitation
 * on the same portal should use unique emails.
 */
export const getWorkspaceInviteLink = async (email: string) => {
  const invite = await client.workspaceInvite.findFirst({
    where: { email },
  });

  if (!invite?.token) {
    throw new Error('Invitation not found');
  }

  return `${BASE_URL}/app/join?invite-token=${invite.token}`;
};

/**
 * sample usage
 */
// (async () => {
//   const result = await getSignupLink('test1@blockqueue.dev');
//   console.log('==result==', result);
// })();
