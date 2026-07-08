import {
  type CommandArguments,
  type CommandArgumentListFieldSchema,
  type CommandArgumentListFieldType,
  type CommandArgumentListValue,
  type CommandArgumentScalarValue,
  type CommandArgumentValue,
  type CommandExecutionResult,
  type RegisteredSessionCommand,
  type SessionCommand,
  type CommandArgumentSchema,
  type CommandScalarArgumentType,
  type CommandExecutionContext,
  type ListCommandArgumentSchema,
  type ScalarCommandArgumentSchema,
  commandRequiresArguments,
  defineSessionCommand,
  insertAtCommandRange,
  isListArgumentSchema,
} from "@/common/sessionCommandBase";
import { sessionCommands } from "./commands";

export type {
  CommandArguments,
  CommandArgumentListFieldSchema,
  CommandArgumentListFieldType,
  CommandArgumentListValue,
  CommandArgumentScalarValue,
  CommandArgumentValue,
  CommandExecutionResult,
  RegisteredSessionCommand,
  SessionCommand,
  CommandArgumentSchema,
  CommandScalarArgumentType,
  CommandExecutionContext,
  ListCommandArgumentSchema,
  ScalarCommandArgumentSchema,
};
export {
  commandRequiresArguments,
  defineSessionCommand,
  insertAtCommandRange,
  isListArgumentSchema,
};

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

export const sessionCommandRegistry = sessionCommands.reduce(
  (registry, command) => {
    registry.register(command);
    return registry;
  },
  new SessionCommandRegistry()
);
