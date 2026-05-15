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

// Ported directly from iron-session/next/index.js — plain assignment doesn't
// work because the property needs a paired getter+setter to proxy mutations
// back into the sealed session object.
function getPropertyDescriptorForReqSession(session: any): PropertyDescriptor {
  return {
    enumerable: true,
    get() {
      return session;
    },
    set(value: any) {
      const keys = Object.keys(value);
      const currentKeys = Object.keys(session);
      currentKeys.forEach((key) => {
        if (!keys.includes(key)) {
          delete session[key];
        }
      });
      keys.forEach((key) => {
        session[key] = value[key];
      });
    },
  };
}

export async function getSession(req: NextApiRequest, res: NextApiResponse) {
  return getIronSession(req, res, sessionOptions);
}

export function withSessionRoute(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const session = await getIronSession(req, res, sessionOptions);
    Object.defineProperty(req, "session", getPropertyDescriptorForReqSession(session));
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
  return async function (context: GetServerSidePropsContext) {
    const session = await getIronSession(context.req, context.res, sessionOptions);
    Object.defineProperty(context.req, "session", getPropertyDescriptorForReqSession(session));
    return handler(context);
  };
}
