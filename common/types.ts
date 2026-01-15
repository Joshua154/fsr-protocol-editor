
export type SessionItem = {
  id: string;
  topic: string;
  points: string[];
};

export type ProtocolData = {
  FSR: string[];
  Protokollant: string;
  WeiterePersonen: string[];
  Date: string;
  Start: string;
  Ende: string;
  Sitzung: Record<string, string[]>;
  [key: string]: unknown;
};
