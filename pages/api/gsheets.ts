// pages/api/check_auth.ts
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const tokens = cookies.google_tokens ? JSON.parse(cookies.google_tokens) : null;

  if (!tokens) return res.status(401).json({ authenticated: false });
  return res.status(200).json({ authenticated: true });
}
