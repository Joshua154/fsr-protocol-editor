import {
  asRegisteredSessionCommand,
  defineSessionCommand,
} from "@/common/sessionCommandBase";

type NoArgs = Record<string, never>;

export default asRegisteredSessionCommand(
  defineSessionCommand<NoArgs>({
    name: "time",
    description: "Aktuelle Uhrzeit einfügen",
    arguments: [],
    execute: () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return { text: timeStr, data: { type: "time", time: timeStr }, shouldReplaceCommand: true };
    },
  })
);
