import {
  asRegisteredSessionCommand,
  defineSessionCommand,
} from "@/common/sessionCommandBase";

type NoArgs = Record<string, never>;

export default asRegisteredSessionCommand(
  defineSessionCommand<NoArgs>({
    name: "tableunflipp",
    description: "Table Unflipp",
    arguments: [],
    execute: () => {
      return { text: "┬─┬ ノ( ゜- ゜)ノ", data: {}, shouldReplaceCommand: true };
    },
  })
);
