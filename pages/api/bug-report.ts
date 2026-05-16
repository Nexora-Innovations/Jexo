import type { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "@/lib/withSession";

type Data = { success: boolean; error?: string };

const SEVERITY_COLORS: Record<string, number> = {
  low:      0x6b7280, // gray
  medium:   0xf59e0b, // amber
  high:     0xef4444, // red
  critical: 0x7c3aed, // purple
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  if (!req.session.userid) {
    return res.status(401).json({ success: false, error: "Not logged in" });
  }

  const { title, description, severity, page, username } = req.body as {
    title?: string;
    description?: string;
    severity?: string;
    page?: string;
    username?: string;
  };

  if (!title?.trim() || !description?.trim()) {
    return res.status(400).json({ success: false, error: "Title and description are required" });
  }

  if (title.length > 150 || description.length > 1500) {
    return res.status(400).json({ success: false, error: "Content too long" });
  }

  const webhookUrl = process.env.BUG_REPORT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[bug-report] BUG_REPORT_WEBHOOK_URL is not set");
    return res.status(500).json({ success: false, error: "Bug reporting is not configured" });
  }

  const color = SEVERITY_COLORS[severity ?? "medium"] ?? SEVERITY_COLORS.medium;
  const severityLabel = (severity ?? "medium").charAt(0).toUpperCase() + (severity ?? "medium").slice(1);

  try {
    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Jex Bug Reports",
        avatar_url: "https://jexo.vercel.app/favicon-16x16.png",
        embeds: [
          {
            title: `🐛 ${title.trim()}`,
            description: description.trim(),
            color,
            fields: [
              {
                name: "Severity",
                value: severityLabel,
                inline: true,
              },
              {
                name: "Reporter",
                value: username ? `${username} (ID: ${req.session.userid})` : `User #${req.session.userid}`,
                inline: true,
              },
              ...(page
                ? [{ name: "Page", value: page, inline: false }]
                : []),
            ],
            timestamp: new Date().toISOString(),
            footer: { text: "Jex Bug Report" },
          },
        ],
      }),
    });

    // Discord returns 204 No Content on success
    if (!webhookRes.ok) {
      const text = await webhookRes.text().catch(() => "");
      console.error(`[bug-report] Discord webhook responded ${webhookRes.status}: ${text}`);
      return res.status(502).json({ success: false, error: "Failed to send report" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[bug-report] Network error calling Discord webhook:", err);
    return res.status(502).json({ success: false, error: "Failed to send report" });
  }
}

export default withSessionRoute(handler);