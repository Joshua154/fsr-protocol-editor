
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

export type Member = {
  name: string;
  aliases?: string[];
};

export type EnvVariables = {
  FSR_MEMBERS?: Member[] | string;
  ASSOCIATED_MEMBERS?: Member[] | string;
};