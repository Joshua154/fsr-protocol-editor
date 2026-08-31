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
import { Badge, Button, FieldLabel } from "@/components/ui/Primitives";

type Props = {
  command: RegisteredSessionCommand;
  onSubmit: (args: CommandArguments) => void;
  onCancel: () => void;
};

const fieldClassName = "ui-input text-sm";

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
    <form onSubmit={submit} className="space-y-5">
      <div className="rounded-xl bg-accent p-4">
        <Badge tone="accent">/{command.name}</Badge>
        <p className="mt-2 text-sm leading-relaxed text-accent-foreground">
          {command.description}
        </p>
      </div>

      <div className="space-y-3">
        {command.arguments.map((argument) => {
          if (isListArgumentSchema(argument)) {
            const shouldFocus = argument.name === firstFocusableArgumentName;

            return (
              <div key={argument.name} className="block space-y-1.5">
                <FieldLabel>{argument.label}</FieldLabel>
                {argument.description && (
                  <span className="block text-xs leading-relaxed text-muted-foreground">
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
        <Button
          type="button"
          onClick={onCancel}
          variant="quiet"
        >
          Abbrechen
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          Einfügen
        </Button>
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
      <FieldLabel className="mb-0">{schema.label}</FieldLabel>
      {schema.description && (
        <span className="block text-xs leading-relaxed text-muted-foreground">
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
      {error && <span className="text-xs font-medium text-destructive" role="alert">{error}</span>}
    </label>
  );
}
