import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, {
    password: process.env.SESSION_SECRET!,
    cookieName: 'ephemeral-board-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1週間
    },
  });

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
}

export async function login(password: string): Promise<boolean> {
  if (password === process.env.BOARD_PASSWORD) {
    const session = await getSession();
    session.isLoggedIn = true;
    await session.save();
    return true;
  }
  return false;
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn;
}