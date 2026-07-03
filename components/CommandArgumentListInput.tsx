import { Plus, Trash2 } from "lucide-react";
import type {
  CommandArgumentListFieldSchema,
  ListCommandArgumentSchema,
} from "@/common/sessionCommandBase";
import {
  getListFieldInputType,
  listErrorKey,
  type CommandArgumentFormErrors,
} from "@/common/commandArguments";

const fieldClassName =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-border dark:bg-zinc-950 dark:text-foreground dark:placeholder:text-muted-foreground dark:focus:border-primary dark:focus:ring-indigo-950";

type Props = {
  schema: ListCommandArgumentSchema;
  items: Record<string, string>[];
  errors: CommandArgumentFormErrors;
  onChange: (items: Record<string, string>[]) => void;
  firstFieldRef?: (element: HTMLInputElement | null) => void;
};

export function CommandArgumentListInput({
  schema,
  items,
  errors,
  onChange,
  firstFieldRef,
}: Props) {
  const itemLabel = schema.itemLabel ?? "Eintrag";
  const addLabel = schema.addLabel ?? "Eintrag hinzufügen";
  const canAdd =
    schema.maxItems == null || items.length < schema.maxItems;
  const minItems = schema.minItems ?? (schema.required === false ? 0 : 1);
  const canRemove = items.length > minItems;

  const updateItem = (
    itemIndex: number,
    fieldName: string,
    value: string
  ) => {
    onChange(
      items.map((item, index) =>
        index === itemIndex ? { ...item, [fieldName]: value } : item
      )
    );
  };

  const addItem = () => {
    if (!canAdd) return;
    onChange([
      ...items,
      Object.fromEntries(schema.fields.map((field) => [field.name, ""])),
    ]);
  };

  const removeItem = (itemIndex: number) => {
    if (!canRemove) return;
    onChange(items.filter((_, index) => index !== itemIndex));
  };

  return (
    <div className="space-y-3">
      {errors[schema.name] && (
        <span className="text-xs text-red-500">{errors[schema.name]}</span>
      )}

      {items.map((item, itemIndex) => (
        <div
          key={itemIndex}
          className="rounded-md border border-slate-200 p-3 dark:border-border"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-muted-foreground">
              {itemLabel} {itemIndex + 1}
            </span>
            {canRemove && (
              <button
                type="button"
                onClick={() => removeItem(itemIndex)}
                className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                aria-label={`${itemLabel} entfernen`}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div className="space-y-2">
            {schema.fields.map((field, fieldIndex) => (
              <ListField
                key={field.name}
                field={field}
                value={item[field.name] ?? ""}
                error={
                  errors[listErrorKey(schema.name, itemIndex, field.name)]
                }
                inputRef={
                  itemIndex === 0 && fieldIndex === 0 ? firstFieldRef : undefined
                }
                onChange={(value) => updateItem(itemIndex, field.name, value)}
              />
            ))}
          </div>
        </div>
      ))}

      {canAdd && (
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <Plus size={14} />
          {addLabel}
        </button>
      )}
    </div>
  );
}

function ListField({
  field,
  value,
  error,
  inputRef,
  onChange,
}: {
  field: CommandArgumentListFieldSchema;
  value: string;
  error?: string;
  inputRef?: (element: HTMLInputElement | null) => void;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {field.label}
      </span>
      <input
        ref={inputRef}
        type={getListFieldInputType(field)}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        className={fieldClassName}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
