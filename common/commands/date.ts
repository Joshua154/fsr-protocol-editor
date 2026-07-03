import {
  asRegisteredSessionCommand,
  defineSessionCommand,
} from "@/common/sessionCommandBase";

type NoArgs = Record<string, never>;

export default asRegisteredSessionCommand(
  defineSessionCommand<NoArgs>({
    name: "date",
    description: "Aktuelles Datum einfügen",
    arguments: [],
    execute: () => {
      const dateStr = new Date().toISOString().split("T")[0];
      return { text: dateStr, data: { type: "date", date: dateStr }, shouldReplaceCommand: true };
    },
  })
);
