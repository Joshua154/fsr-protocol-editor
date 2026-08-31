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
import { Button, FieldLabel } from "@/components/ui/Primitives";

const fieldClassName = "ui-input text-sm";

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
        <span className="text-xs font-medium text-destructive" role="alert">{errors[schema.name]}</span>
      )}

      {items.map((item, itemIndex) => (
        <div
          key={itemIndex}
          className="rounded-xl border border-border bg-[color:var(--muted)]/35 p-3"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
              {itemLabel} {itemIndex + 1}
            </span>
            {canRemove && (
              <Button
                type="button"
                onClick={() => removeItem(itemIndex)}
                variant="quiet"
                size="icon"
                className="h-8 min-h-8 w-8 text-muted-foreground hover:bg-[var(--destructive-soft)] hover:text-destructive"
                aria-label={`${itemLabel} entfernen`}
              >
                <Trash2 size={14} />
              </Button>
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
        <Button
          type="button"
          onClick={addItem}
          variant="quiet"
          size="sm"
          className="text-primary"
        >
          <Plus size={14} />
          {addLabel}
        </Button>
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
      <FieldLabel className="mb-0 text-xs">{field.label}</FieldLabel>
      <input
        ref={inputRef}
        type={getListFieldInputType(field)}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        className={fieldClassName}
      />
      {error && <span className="text-xs font-medium text-destructive" role="alert">{error}</span>}
    </label>
  );
}
