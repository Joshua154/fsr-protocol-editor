export type CommandScalarArgumentType =
  | "integer"
  | "number"
  | "string"
  | "boolean"
  | "date"
  | "time";

export type CommandArgumentListFieldType = "string" | "date" | "time";

export type CommandArgumentListFieldSchema = {
  name: string;
  label: string;
  type: CommandArgumentListFieldType;
  required?: boolean;
  placeholder?: string;
};

export type CommandArgumentListValue = Record<string, CommandArgumentScalarValue>[];

export type CommandArgumentScalarValue = string | number | boolean;

export type CommandArgumentValue =
  | CommandArgumentScalarValue
  | CommandArgumentListValue;

export type CommandArguments = Record<string, CommandArgumentValue>;

type CommandArgumentSchemaBase = {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
};

export type ScalarCommandArgumentSchema = CommandArgumentSchemaBase & {
  type: CommandScalarArgumentType;
  min?: number;
  max?: number;
  placeholder?: string;
};

export type ListCommandArgumentSchema = CommandArgumentSchemaBase & {
  type: "list";
  itemLabel?: string;
  addLabel?: string;
  minItems?: number;
  maxItems?: number;
  fields: CommandArgumentListFieldSchema[];
};

export type CommandArgumentSchema =
  | ScalarCommandArgumentSchema
  | ListCommandArgumentSchema;

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

export const asRegisteredSessionCommand = <TArgs extends CommandArguments>(
  command: SessionCommand<TArgs>
) => command as RegisteredSessionCommand;

export function isListArgumentSchema(
  schema: CommandArgumentSchema
): schema is ListCommandArgumentSchema {
  return schema.type === "list";
}

export function commandRequiresArguments(
  command: Pick<SessionCommand, "arguments">
): boolean {
  return command.arguments.length > 0;
}

export function insertAtCommandRange(
  text: string,
  triggerIndex: number,
  cursorIndex: number,
  insert: string
): { nextText: string; nextCursor: number } {
  const before = text.slice(0, triggerIndex);
  const after = text.slice(cursorIndex);
  const needsSpace = after.length > 0 && !/^\s/.test(after);
  const spacer = needsSpace ? " " : "";
  return {
    nextText: `${before}${insert}${spacer}${after}`,
    nextCursor: before.length + insert.length + spacer.length,
  };
}
