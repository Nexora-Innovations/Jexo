// Roblox Open Cloud API utility
// API key needs: group:read + group:write (Member Membership) permissions
// Create keys at: https://create.roblox.com/credentials

const BASE = "https://apis.roblox.com/cloud/v2";

export interface OcRole {
  path: string;       // e.g. "groups/123/roles/456"
  id: string;
  displayName: string;
  description: string;
  rank: number;       // 0–255
  memberCount?: number;
}

export interface OcMembership {
  path: string;       // e.g. "groups/123/memberships/789"
  user: string;       // e.g. "users/12345"
  role: string;       // e.g. "groups/123/roles/456"
}

async function ocFetch(
  apiKey: string,
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${BASE}/${path}`, {
	...options,
	headers: {
	  "x-api-key": apiKey,
	  "Content-Type": "application/json",
	  ...(options.headers ?? {}),
	},
  });
}

/** Fetch all roles for a group */
export async function getGroupRoles(apiKey: string, groupId: number): Promise<OcRole[]> {
  const res = await ocFetch(apiKey, `groups/${groupId}/roles?maxPageSize=100`);
  if (!res.ok) throw new Error(`Open Cloud getRoles failed: ${res.status}`);
  const data = await res.json();
  return (data.groupRoles ?? []) as OcRole[];
}

/** Get a user's current membership in a group (returns null if not a member) */
export async function getUserMembership(
  apiKey: string,
  groupId: number,
  userId: number
): Promise<OcMembership | null> {
  const filter = encodeURIComponent(`user == 'users/${userId}'`);
  const res = await ocFetch(apiKey, `groups/${groupId}/memberships?filter=${filter}&maxPageSize=1`);
  if (!res.ok) throw new Error(`Open Cloud getMembership failed: ${res.status}`);
  const data = await res.json();
  return (data.groupMemberships?.[0] ?? null) as OcMembership | null;
}

/** Change a user's rank in a group */
export async function rankUser(
  apiKey: string,
  groupId: number,
  userId: number,
  roleId: string   // the full role path e.g. "groups/123/roles/456"
): Promise<void> {
  const membership = await getUserMembership(apiKey, groupId, userId);
  if (!membership) throw new Error("User is not a member of this group");

  const res = await ocFetch(apiKey, membership.path, {
	method: "PATCH",
	body: JSON.stringify({ role: roleId }),
  });

  if (!res.ok) {
	const text = await res.text().catch(() => "");
	throw new Error(`Open Cloud rankUser failed: ${res.status} ${text}`);
  }
}

/** Quick connectivity test — just fetches one role page */
export async function testApiKey(apiKey: string, groupId: number): Promise<boolean> {
  try {
	await getGroupRoles(apiKey, groupId);
	return true;
  } catch {
	return false;
  }
}
