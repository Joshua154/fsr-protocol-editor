import voteCommand from "./vote";
import dateCommand from "./date";
import fuckyou from "./fuckyou";
import tableflipp from "./tableflipp";
import tableunflipp from "./tableunflipp";
import timeCommand from "./time";
import todolistCommand from "./todolist";
import type { RegisteredSessionCommand } from "@/common/sessionCommandBase";

export const sessionCommands: RegisteredSessionCommand[] = [
  voteCommand,
  dateCommand,
  fuckyou,
  tableflipp,
  tableunflipp,
  timeCommand,
  todolistCommand
];
