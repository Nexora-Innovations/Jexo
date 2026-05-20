// pages/api/csrf.ts
// Simple CSRF token endpoint used by useCsrfToken hook
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/lib/withSession";
import crypto from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
	return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getSession(req, res);
  // Derive a token from the session — stable per session, nothing stored
  const seed = session.userid
	? `${session.userid}-${process.env.SECRET_COOKIE_PASSWORD ?? "fallback"}`
	: crypto.randomBytes(16).toString("hex");

  const token = crypto
	.createHmac("sha256", process.env.SECRET_COOKIE_PASSWORD ?? "fallback")
	.update(seed)
	.digest("hex");

  return res.status(200).json({ token });
}
