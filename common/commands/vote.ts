import {
  asRegisteredSessionCommand,
  defineSessionCommand,
} from "@/common/sessionCommandBase";

type VoteArgs = {
  zustimmung: number;
  ablehnung: number;
  enthaltung: number;
};

export default asRegisteredSessionCommand(
  defineSessionCommand<VoteArgs>({
    name: "vote",
    description: "Abstimmung mit Zustimmung, Ablehnung und Enthaltung einfügen",
    arguments: [
      { name: "zustimmung", label: "Zustimmung", type: "integer", required: true, min: 0, placeholder: "0" },
      { name: "ablehnung", label: "Ablehnung", type: "integer", required: true, min: 0, placeholder: "0" },
      { name: "enthaltung", label: "Enthaltung", type: "integer", required: true, min: 0, placeholder: "0" },
    ],
    execute: (args) => ({
      text: `(${args.zustimmung}/${args.ablehnung}/${args.enthaltung}) (dafür/dagegen/enthalten)`,
      data: { type: "vote", ...args },
      shouldReplaceCommand: true,
    }),
  })
);
