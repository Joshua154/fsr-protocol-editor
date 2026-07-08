import type {
  CommandArgumentListFieldSchema,
  CommandArgumentListValue,
  CommandArgumentScalarValue,
  CommandArguments,
  ListCommandArgumentSchema,
  RegisteredSessionCommand,
  ScalarCommandArgumentSchema,
} from "@/common/sessionCommandBase";
import { isListArgumentSchema } from "@/common/sessionCommandBase";

export type ScalarFormValues = Record<string, string>;
export type ListFormValues = Record<string, Record<string, string>[]>;

export type CommandArgumentFormState = {
  scalar: ScalarFormValues;
  list: ListFormValues;
};

export type CommandArgumentFormErrors = Record<string, string>;

function createEmptyListItem(
  schema: ListCommandArgumentSchema
): Record<string, string> {
  return Object.fromEntries(schema.fields.map((field) => [field.name, ""]));
}

export function createInitialFormState(
  command: RegisteredSessionCommand
): CommandArgumentFormState {
  const scalar: ScalarFormValues = {};
  const list: ListFormValues = {};

  for (const argument of command.arguments) {
    if (isListArgumentSchema(argument)) {
      const minItems = argument.minItems ?? (argument.required === false ? 0 : 1);
      list[argument.name] = Array.from({ length: minItems }, () =>
        createEmptyListItem(argument)
      );
      continue;
    }
    scalar[argument.name] = "";
  }

  return { scalar, list };
}

function validateScalarField(
  schema: ScalarCommandArgumentSchema,
  rawValue: string
): string | null {
  const trimmedValue = rawValue.trim();

  if (schema.required && trimmedValue === "") return "Pflichtfeld";
  if (!schema.required && trimmedValue === "") return null;

  if (schema.type === "integer" || schema.type === "number") {
    const value = Number(trimmedValue);
    if (!Number.isFinite(value)) return "Bitte eine Zahl eingeben";
    if (schema.type === "integer" && !Number.isInteger(value)) {
      return "Bitte eine ganze Zahl eingeben";
    }
    if (schema.min != null && value < schema.min) {
      return `Mindestens ${schema.min}`;
    }
    if (schema.max != null && value > schema.max) {
      return `Maximal ${schema.max}`;
    }
  }

  if (schema.type === "date" && Number.isNaN(Date.parse(trimmedValue))) {
    return "Bitte ein gültiges Datum eingeben";
  }

  if (schema.type === "time" && !/^\d{2}:\d{2}$/.test(trimmedValue)) {
    return "Bitte eine gültige Uhrzeit eingeben";
  }

  return null;
}

function validateListField(
  field: CommandArgumentListFieldSchema,
  rawValue: string
): string | null {
  const trimmedValue = rawValue.trim();

  if (field.required && trimmedValue === "") return "Pflichtfeld";
  if (!field.required && trimmedValue === "") return null;

  if (field.type === "date" && Number.isNaN(Date.parse(trimmedValue))) {
    return "Bitte ein gültiges Datum eingeben";
  }

  if (field.type === "time" && !/^\d{2}:\d{2}$/.test(trimmedValue)) {
    return "Bitte eine gültige Uhrzeit eingeben";
  }

  return null;
}

function listErrorKey(
  argumentName: string,
  itemIndex: number,
  fieldName: string
): string {
  return `${argumentName}.${itemIndex}.${fieldName}`;
}

export function validateCommandArguments(
  command: RegisteredSessionCommand,
  state: CommandArgumentFormState
): CommandArgumentFormErrors {
  const errors: CommandArgumentFormErrors = {};

  for (const argument of command.arguments) {
    if (isListArgumentSchema(argument)) {
      const items = state.list[argument.name] ?? [];
      const minItems = argument.minItems ?? (argument.required === false ? 0 : 1);

      if (argument.required && items.length === 0) {
        errors[argument.name] = "Mindestens ein Eintrag erforderlich";
      }

      if (items.length < minItems) {
        errors[argument.name] = `Mindestens ${minItems} Einträge erforderlich`;
      }

      if (argument.maxItems != null && items.length > argument.maxItems) {
        errors[argument.name] = `Maximal ${argument.maxItems} Einträge erlaubt`;
      }

      items.forEach((item, itemIndex) => {
        for (const field of argument.fields) {
          const error = validateListField(field, item[field.name] ?? "");
          if (error) {
            errors[listErrorKey(argument.name, itemIndex, field.name)] = error;
          }
        }
      });
      continue;
    }

    const error = validateScalarField(argument, state.scalar[argument.name] ?? "");
    if (error) errors[argument.name] = error;
  }

  return errors;
}

function parseScalarField(
  schema: ScalarCommandArgumentSchema,
  rawValue: string
): CommandArgumentScalarValue {
  const trimmedValue = rawValue.trim();

  if (schema.type === "string" || schema.type === "date" || schema.type === "time") {
    return trimmedValue;
  }
  if (schema.type === "boolean") return trimmedValue === "true";

  const value = Number(trimmedValue);
  if (schema.type === "integer") return Math.trunc(value);
  return value;
}

function parseListField(
  field: CommandArgumentListFieldSchema,
  rawValue: string
): CommandArgumentScalarValue {
  return rawValue.trim();
}

export function parseCommandArguments(
  command: RegisteredSessionCommand,
  state: CommandArgumentFormState
): CommandArguments {
  const args: CommandArguments = {};

  for (const argument of command.arguments) {
    if (isListArgumentSchema(argument)) {
      const items = state.list[argument.name] ?? [];
      args[argument.name] = items.map((item) =>
        Object.fromEntries(
          argument.fields.map((field) => [
            field.name,
            parseListField(field, item[field.name] ?? ""),
          ])
        )
      ) as CommandArgumentListValue;
      continue;
    }

    args[argument.name] = parseScalarField(
      argument,
      state.scalar[argument.name] ?? ""
    );
  }

  return args;
}

export function getScalarInputType(
  schema: ScalarCommandArgumentSchema
): "text" | "number" | "date" | "time" {
  if (schema.type === "integer" || schema.type === "number") return "number";
  if (schema.type === "date") return "date";
  if (schema.type === "time") return "time";
  return "text";
}

export function getListFieldInputType(
  field: CommandArgumentListFieldSchema
): "text" | "date" | "time" {
  if (field.type === "date") return "date";
  if (field.type === "time") return "time";
  return "text";
}

export { listErrorKey };
