import {
  asRegisteredSessionCommand,
  defineSessionCommand,
} from "@/common/sessionCommandBase";

type NoArgs = Record<string, never>;

export default asRegisteredSessionCommand(
  defineSessionCommand<NoArgs>({
    name: "fy",
    description: "fy",
    arguments: [],
    execute: () => {
      return { text: "༼ つ ◕_◕ ༽つᶠᶸᶜᵏᵧₒᵤ!", data: {}, shouldReplaceCommand: true };
    },
  })
);
