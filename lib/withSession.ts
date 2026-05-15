import { getIronSession } from "iron-session";
import type { IronSessionOptions } from "iron-session";
import * as crypto from "crypto";
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
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

// getIronSession returns the session object — must be explicitly assigned to req.session
export async function getSession(req: NextApiRequest, res: NextApiResponse) {
  return getIronSession(req, res, sessionOptions);
}

export function withSessionRoute(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    req.session = await getIronSession(req, res, sessionOptions);
    return handler(req, res);
  };
}

export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
  handler: (
    context: GetServerSidePropsContext,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return async (context: GetServerSidePropsContext) => {
    context.req.session = await getIronSession(context.req, context.res, sessionOptions);
    return handler(context);
  };
}