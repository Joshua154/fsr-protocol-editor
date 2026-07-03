import React, { FormEvent, useMemo, useState } from "react";
import type {
  CommandArguments,
  CommandArgumentSchema,
  CommandArgumentValue,
  RegisteredSessionCommand,
} from "@/common/sessionCommands";

type Props = {
  command: RegisteredSessionCommand;
  onSubmit: (args: CommandArguments) => void;
  onCancel: () => void;
};

type FormState = Record<string, string>;
type FormErrors = Record<string, string>;

const parseArgument = (
  schema: CommandArgumentSchema,
  rawValue: string
): CommandArgumentValue => {
  const trimmedValue = rawValue.trim();

  if (schema.type === "string") return trimmedValue;
  if (schema.type === "boolean") return trimmedValue === "true";

  const value = Number(trimmedValue);
  if (schema.type === "integer") return Math.trunc(value);
  return value;
};

const validateArgument = (
  schema: CommandArgumentSchema,
  rawValue: string
): string | null => {
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

  return null;
};

export function CommandArgumentForm({ command, onSubmit, onCancel }: Props) {
  const initialValues = useMemo(
    () =>
      Object.fromEntries(
        command.arguments.map((argument) => [argument.name, ""])
      ) as FormState,
    [command]
  );
  const [values, setValues] = useState<FormState>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = Object.fromEntries(
      command.arguments
        .map((argument) => [
          argument.name,
          validateArgument(argument, values[argument.name] ?? ""),
        ])
        .filter((entry): entry is [string, string] => entry[1] != null)
    );

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const parsedArgs = Object.fromEntries(
      command.arguments.map((argument) => [
        argument.name,
        parseArgument(argument, values[argument.name] ?? ""),
      ])
    );

    onSubmit(parsedArgs);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          /{command.name}
        </p>
        <p className="text-sm text-slate-500 dark:text-muted-foreground">
          {command.description}
        </p>
      </div>

      <div className="space-y-3">
        {command.arguments.map((argument) => {
          const error = errors[argument.name];
          return (
            <label key={argument.name} className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {argument.label}
              </span>
              {argument.description && (
                <span className="block text-xs text-slate-500 dark:text-muted-foreground">
                  {argument.description}
                </span>
              )}
              {argument.type === "boolean" ? (
                <select
                  value={values[argument.name] ?? "false"}
                  onChange={(event) => {
                    setValues((current) => ({
                      ...current,
                      [argument.name]: event.target.value,
                    }));
                    setErrors((current) => ({ ...current, [argument.name]: "" }));
                  }}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-border dark:bg-zinc-950 dark:text-foreground dark:focus:border-primary dark:focus:ring-indigo-950"
                >
                  <option value="true">Ja</option>
                  <option value="false">Nein</option>
                </select>
              ) : (
                <input
                  type={argument.type === "string" ? "text" : "number"}
                  step={argument.type === "integer" ? 1 : "any"}
                  min={argument.min}
                  max={argument.max}
                  value={values[argument.name] ?? ""}
                  onChange={(event) => {
                    setValues((current) => ({
                      ...current,
                      [argument.name]: event.target.value,
                    }));
                    setErrors((current) => ({ ...current, [argument.name]: "" }));
                  }}
                  placeholder={argument.placeholder}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-border dark:bg-zinc-950 dark:text-foreground dark:placeholder:text-muted-foreground dark:focus:border-primary dark:focus:ring-indigo-950"
                />
              )}
              {error && <span className="text-xs text-red-500">{error}</span>}
            </label>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-800"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-indigo-400"
        >
          Einfügen
        </button>
      </div>
    </form>
  );
}
