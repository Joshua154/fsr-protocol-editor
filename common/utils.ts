import { SessionItem } from "./types";

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
