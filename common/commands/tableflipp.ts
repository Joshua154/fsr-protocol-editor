import {
  asRegisteredSessionCommand,
  defineSessionCommand,
} from "@/common/sessionCommandBase";

type NoArgs = Record<string, never>;

export default asRegisteredSessionCommand(
  defineSessionCommand<NoArgs>({
    name: "tableflipp",
    description: "Table Flipp",
    arguments: [],
    execute: () => {
      return { text: "(╯°□°)╯︵ ┻━┻", data: {}, shouldReplaceCommand: true };
    },
  })
);
