import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "ses-analysis-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
