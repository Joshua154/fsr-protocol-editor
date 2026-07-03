import React, { FormEvent, useCallback, useMemo, useState } from "react";
import {
  createInitialFormState,
  getScalarInputType,
  parseCommandArguments,
  validateCommandArguments,
  type CommandArgumentFormErrors,
} from "@/common/commandArguments";
import { isListArgumentSchema } from "@/common/sessionCommandBase";
import type {
  CommandArguments,
  RegisteredSessionCommand,
  ScalarCommandArgumentSchema,
} from "@/common/sessionCommands";
import { CommandArgumentListInput } from "@/components/CommandArgumentListInput";

type Props = {
  command: RegisteredSessionCommand;
  onSubmit: (args: CommandArguments) => void;
  onCancel: () => void;
};

const fieldClassName =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-border dark:bg-zinc-950 dark:text-foreground dark:placeholder:text-muted-foreground dark:focus:border-primary dark:focus:ring-indigo-950";

export function CommandArgumentForm({ command, onSubmit, onCancel }: Props) {
  const initialState = useMemo(() => createInitialFormState(command), [command]);
  const [scalarValues, setScalarValues] = useState(initialState.scalar);
  const [listValues, setListValues] = useState(initialState.list);
  const [errors, setErrors] = useState<CommandArgumentFormErrors>({});

  const focusFirstField = useCallback(
    (element: HTMLInputElement | HTMLSelectElement | null) => {
      element?.focus();
    },
    []
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const state = { scalar: scalarValues, list: listValues };
    const nextErrors = validateCommandArguments(command, state);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit(parseCommandArguments(command, state));
  };

  const firstFocusableArgumentName = command.arguments[0]?.name ?? null;

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
          if (isListArgumentSchema(argument)) {
            const shouldFocus = argument.name === firstFocusableArgumentName;

            return (
              <div key={argument.name} className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {argument.label}
                </span>
                {argument.description && (
                  <span className="block text-xs text-slate-500 dark:text-muted-foreground">
                    {argument.description}
                  </span>
                )}
                <CommandArgumentListInput
                  schema={argument}
                  items={listValues[argument.name] ?? []}
                  errors={errors}
                  onChange={(items) => {
                    setListValues((current) => ({
                      ...current,
                      [argument.name]: items,
                    }));
                    setErrors((current) => {
                      const next = { ...current };
                      delete next[argument.name];
                      items.forEach((_, itemIndex) => {
                        for (const field of argument.fields) {
                          delete next[`${argument.name}.${itemIndex}.${field.name}`];
                        }
                      });
                      return next;
                    });
                  }}
                  firstFieldRef={
                    shouldFocus
                      ? (element) => focusFirstField(element)
                      : undefined
                  }
                />
              </div>
            );
          }

          const error = errors[argument.name];
          const shouldFocus = argument.name === firstFocusableArgumentName;

          return (
            <ScalarField
              key={argument.name}
              schema={argument}
              value={scalarValues[argument.name] ?? ""}
              error={error}
              inputRef={shouldFocus ? focusFirstField : undefined}
              onChange={(value) => {
                setScalarValues((current) => ({
                  ...current,
                  [argument.name]: value,
                }));
                setErrors((current) => ({ ...current, [argument.name]: "" }));
              }}
            />
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

function ScalarField({
  schema,
  value,
  error,
  inputRef,
  onChange,
}: {
  schema: ScalarCommandArgumentSchema;
  value: string;
  error?: string;
  inputRef?: (element: HTMLInputElement | HTMLSelectElement | null) => void;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {schema.label}
      </span>
      {schema.description && (
        <span className="block text-xs text-slate-500 dark:text-muted-foreground">
          {schema.description}
        </span>
      )}
      {schema.type === "boolean" ? (
        <select
          ref={inputRef}
          value={value || "false"}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClassName}
        >
          <option value="true">Ja</option>
          <option value="false">Nein</option>
        </select>
      ) : (
        <input
          ref={inputRef}
          type={getScalarInputType(schema)}
          step={schema.type === "integer" ? 1 : "any"}
          min={schema.min}
          max={schema.max}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={schema.placeholder}
          className={fieldClassName}
        />
      )}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
