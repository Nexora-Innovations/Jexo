// pages/api/workspace/[id]/settings/opencloud.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withPermissionCheck } from "@/utils/permissionsManager";
import { getConfig, setConfig, refresh } from "@/utils/configEngine";
import { testApiKey } from "@/utils/openCloud";

const CONFIG_KEY = "openCloudApiKey";

type Data = { success: boolean; error?: string; hasKey?: boolean };

export default withPermissionCheck(handler);   // no permission = any workspace member

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const groupId = parseInt(req.query.id as string);

  if (isNaN(groupId)) {
    return res.status(400).json({ success: false, error: "Invalid workspace ID" });
  }

  // ── GET — does a key exist? (never return the key itself) ──
  if (req.method === "GET") {
    try {
      const val = await getConfig(CONFIG_KEY, groupId) as { apiKey?: string | null } | null;
      return res.status(200).json({ success: true, hasKey: !!(val?.apiKey) });
    } catch (err) {
      console.error("[opencloud GET]", err);
      return res.status(500).json({ success: false, error: "Failed to read config" });
    }
  }

  // ── POST — save a new key after verifying it works ──
  if (req.method === "POST") {
    try {
      const { apiKey } = req.body as { apiKey?: string };
      if (!apiKey?.trim()) {
        return res.status(400).json({ success: false, error: "API key is required" });
      }

      const valid = await testApiKey(apiKey.trim(), groupId);
      if (!valid) {
        return res.status(400).json({
          success: false,
          error: "Could not verify this key. Make sure it has group:read permission for this group.",
        });
      }

      await setConfig(CONFIG_KEY, { apiKey: apiKey.trim() }, groupId);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("[opencloud POST]", err);
      return res.status(500).json({ success: false, error: "Failed to save config" });
    }
  }

  // ── DELETE — clear the key by nulling it out ──
  if (req.method === "DELETE") {
    try {
      await setConfig(CONFIG_KEY, { apiKey: null }, groupId);
      await refresh(CONFIG_KEY, groupId);       // bust the in-memory cache
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("[opencloud DELETE]", err);
      return res.status(500).json({ success: false, error: "Failed to remove config" });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}