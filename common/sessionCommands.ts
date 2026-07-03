export type CommandArgumentType = "integer" | "number" | "string" | "boolean";

export type CommandArgumentValue = string | number | boolean;

export type CommandArguments = Record<string, CommandArgumentValue>;

export type CommandArgumentSchema = {
  name: string;
  label: string;
  description?: string;
  type: CommandArgumentType;
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
};

export type CommandExecutionContext = {
  sourceText: string;
  triggerIndex: number;
  cursorIndex: number;
};

export type CommandExecutionResult = {
  text: string;
  data?: unknown;
  shouldReplaceCommand?: boolean;
};

export type SessionCommand<TArgs extends CommandArguments = CommandArguments> = {
  name: string;
  description: string;
  arguments: CommandArgumentSchema[];
  execute: (
    args: TArgs,
    context: CommandExecutionContext
  ) => CommandExecutionResult | Promise<CommandExecutionResult>;
};

export type RegisteredSessionCommand = Omit<
  SessionCommand<CommandArguments>,
  "execute"
> & {
  execute: (
    args: CommandArguments,
    context: CommandExecutionContext
  ) => CommandExecutionResult | Promise<CommandExecutionResult>;
};

export const defineSessionCommand = <TArgs extends CommandArguments>(
  command: SessionCommand<TArgs>
) => command;

export class SessionCommandRegistry {
  private commands = new Map<string, RegisteredSessionCommand>();

  register<TArgs extends CommandArguments>(command: SessionCommand<TArgs>) {
    const key = command.name.toLowerCase();
    if (this.commands.has(key)) {
      throw new Error(`Session command "${command.name}" is already registered.`);
    }
    this.commands.set(key, command as unknown as RegisteredSessionCommand);
    return this;
  }

  list() {
    return Array.from(this.commands.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  find(name: string) {
    return this.commands.get(name.toLowerCase()) ?? null;
  }

  filter(query: string) {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return this.list();
    return this.list().filter(
      (command) =>
        command.name.toLowerCase().includes(normalizedQuery) ||
        command.description.toLowerCase().includes(normalizedQuery)
    );
  }
}

type VoteArgs = {
  zustimmung: number;
  ablehnung: number;
  enthaltung: number;
};

export const sessionCommandRegistry = new SessionCommandRegistry().register(
  defineSessionCommand<VoteArgs>({
    name: "vote",
    description: "Abstimmung mit Zustimmung, Ablehnung und Enthaltung einfügen",
    arguments: [
      {
        name: "zustimmung",
        label: "Zustimmung",
        type: "integer",
        required: true,
        min: 0,
        placeholder: "0",
      },
      {
        name: "ablehnung",
        label: "Ablehnung",
        type: "integer",
        required: true,
        min: 0,
        placeholder: "0",
      },
      {
        name: "enthaltung",
        label: "Enthaltung",
        type: "integer",
        required: true,
        min: 0,
        placeholder: "0",
      },
    ],
    execute: (args) => ({
      text: `(${args.zustimmung}/${args.ablehnung}/${args.enthaltung}) (dafür/dagegen/enthalten)`,
      data: {
        type: "vote",
        zustimmung: args.zustimmung,
        ablehnung: args.ablehnung,
        enthaltung: args.enthaltung,
      },
      shouldReplaceCommand: true,
    }),
  })
);
