import { useMemo } from "react";

import { filterMembers, normalizeMembers } from "@/common/memberSuggestions";
import type { Member } from "@/common/types";

type Options = {
  enabled?: boolean;
  excludeNames?: string[];
  limit?: number;
};

export function useMemberSuggestions(
  members: Member[],
  query: string,
  options: Options = {}
) {
  const { enabled = true, excludeNames, limit } = options;

  const normalizedMembers = useMemo(
    () => normalizeMembers(members),
    [members]
  );

  const matches = useMemo(() => {
    if (!enabled) return [] as Member[];

    return filterMembers(normalizedMembers, query, {
      excludeNames,
      limit,
    });
  }, [enabled, normalizedMembers, query, excludeNames, limit]);

  return { matches };
}
