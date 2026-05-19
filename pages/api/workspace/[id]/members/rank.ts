// pages/api/workspace/[id]/members/rank.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withPermissionCheck } from "@/utils/permissionsManager";
import { getConfig } from "@/utils/configEngine";
import { rankUser } from "@/utils/openCloud";

type Data = { success: boolean; error?: string };

export default withPermissionCheck(handler, "manage_members");

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const groupId = parseInt(req.query.id as string);
  const { userId, rolePath } = req.body as { userId?: number; rolePath?: string };

  if (!userId || !rolePath) {
    return res.status(400).json({ success: false, error: "userId and rolePath are required" });
  }

  // Load the stored API key
  const config = await getConfig("openCloudApiKey", groupId) as { apiKey?: string } | null;
  if (!config?.apiKey) {
    return res.status(400).json({
      success: false,
      error: "No Open Cloud API key configured. Add one in Settings → Integrations.",
    });
  }

  try {
    await rankUser(config.apiKey, groupId, userId, rolePath);
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("[rank]", err);
    return res.status(500).json({ success: false, error: err.message ?? "Failed to rank user" });
  }
}
