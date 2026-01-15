
export const ENV_FSR_MEMBERS = (process.env.NEXT_PUBLIC_FSR_MEMBERS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const ENV_ASSOC_MEMBERS = (process.env.NEXT_PUBLIC_ASSOCIATED_MEMBERS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
