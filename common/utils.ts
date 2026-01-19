import { SessionItem, EnvVariables, Member } from "./types";

export const sessionObjectToArray = (
  sitzung: Record<string, unknown>
): SessionItem[] => {
  if (!sitzung) return [];
  return Object.entries(sitzung).map(([topic, points], index) => ({
    id: `topic-${index}-${Date.now()}`,
    topic,
    points: (Array.isArray(points) ? points : [points]).map(String).filter((a) => a !== "null"),
  }));
};

export const sessionArrayToObject = (items: SessionItem[]) => {
  const obj: Record<string, string[]> = {};
  items.forEach((item) => {
    if (item.topic.trim()) {
      obj[item.topic] = item.points;
    }
  });
  return obj;
};


const ENV = process.env as EnvVariables;

const parseMembers = (value?: string | Member[]): Member[] => {
  if (!value) return [];

  if (typeof value === "string") {
    return value.split(/,(?![^\[]*\])/).map((entry) => {
      
      const match = entry.match(/^(.*?)\s*\[(.*?)\]\s*$/);
      
      if (match) {
        const name = match[1].trim();
        const aliases = match[2].split(",").map((a) => a.trim()).filter(Boolean);
        return { name, aliases };
      }
      return { name: entry.trim(), aliases: [] };
    }).filter((m) => m.name.length > 0);
  }

  return value.map((m) => ({
    name: (m?.name ?? "").trim(),
    aliases: m.aliases || [],
  })).filter((m) => m.name.length > 0);
};

export function getFSRMembers(): Member[] {
  return parseMembers(ENV.FSR_MEMBERS);
}

export function getAssociatedMembers(): Member[] {
  return parseMembers(ENV.ASSOCIATED_MEMBERS);
}
