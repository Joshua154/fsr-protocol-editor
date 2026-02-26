import { Member } from "@/common/types";

export function normalizeMembers(members: Member[]): Member[] {
  const seen = new Set<string>();
  const out: Member[] = [];

  for (const member of members) {
    const name = (member?.name ?? "").trim();
    if (!name) continue;

    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const aliases = (member?.aliases ?? [])
      .map((a) => String(a).trim())
      .filter(Boolean);

    out.push({ name, aliases });
  }

  return out;
}

type FilterOptions = {
  excludeNames?: string[];
  limit?: number;
};

export function filterMembers(
  members: Member[],
  query: string,
  options: FilterOptions = {}
): Member[] {
  const limit = options.limit ?? 10;
  const exclude = new Set(
    (options.excludeNames ?? []).map((n) => n.toLowerCase())
  );

  const q = query.trim().toLowerCase();
  const filtered = members.filter((m) => {
    if (exclude.has(m.name.toLowerCase())) return false;
    if (!q) return true;
    if (m.name.toLowerCase().includes(q)) return true;
    return (m.aliases ?? []).some((a) => a.toLowerCase().includes(q));
  });

  return filtered.slice(0, limit);
}