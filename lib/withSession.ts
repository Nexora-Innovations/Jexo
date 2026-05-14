import { getIronSession } from "iron-session";
import type { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import * as crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
} from "next";

const password =
  process.env.SECRET_COOKIE_PASSWORD ||
  process.env.SESSION_SECRET ||
  crypto.randomBytes(32).toString("hex");

export const sessionOptions: IronSessionOptions = {
  password,
  cookieName: "tovy-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession(req: NextApiRequest, res: NextApiResponse) {
  return getIronSession(req, res, sessionOptions);
}

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
  handler: (
    context: GetServerSidePropsContext,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return withIronSessionSsr(handler, sessionOptions);
}