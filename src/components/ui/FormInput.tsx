import { ChevronDown } from "lucide-react";
import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-md border bg-surface px-3.5 text-[0.95rem] text-text placeholder:text-subtle transition-[border-color,box-shadow] duration-150 outline-none focus:border-primary focus:ring-3 focus:ring-primary/12 disabled:cursor-not-allowed disabled:bg-surface-muted";

interface FieldShellProps {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FieldShell({ id, label, hint, error, required, optional, className, children }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="flex items-baseline justify-between text-sm font-semibold text-text">
          <span>
            {label}
            {required && (
              <span className="ml-0.5 text-primary" aria-hidden="true">
                *
              </span>
            )}
          </span>
          {optional && <span className="text-xs font-normal text-subtle">Optional</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  containerClassName?: string;
};

export const FormInput = forwardRef<HTMLInputElement, InputProps>(function FormInput(
  { label, hint, error, optional, icon, trailing, className, containerClassName, id, required, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <FieldShell
      id={inputId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      className={containerClassName}
    >
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-subtle">{icon}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            fieldBase,
            "h-12",
            icon && "pl-10",
            trailing && "pr-12",
            error ? "border-danger" : "border-border",
            className,
          )}
          {...rest}
        />
        {trailing && <span className="absolute top-1/2 right-2 -translate-y-1/2">{trailing}</span>}
      </div>
    </FieldShell>
  );
});

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  containerClassName?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, optional, className, containerClassName, id, required, rows = 4, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <FieldShell
      id={inputId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      className={containerClassName}
    >
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={cn(fieldBase, "py-3 leading-relaxed", error ? "border-danger" : "border-border", className)}
        {...rest}
      />
    </FieldShell>
  );
});

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  placeholder?: string;
  options: readonly (string | { value: string; label: string })[];
  containerClassName?: string;
  fieldSize?: "sm" | "md";
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    hint,
    error,
    optional,
    placeholder,
    options,
    className,
    containerClassName,
    id,
    required,
    fieldSize = "md",
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <FieldShell
      id={inputId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      className={containerClassName}
    >
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error || undefined}
          className={cn(
            fieldBase,
            "appearance-none pr-10",
            fieldSize === "sm" ? "h-10 text-sm" : "h-12",
            error ? "border-danger" : "border-border",
            className,
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => {
            const opt = typeof o === "string" ? { value: o, label: o } : o;
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  );
});

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: React.ReactNode;
  description?: string;
};

export function Checkbox({ label, description, className, id, ...rest }: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <label htmlFor={inputId} className={cn("group flex cursor-pointer items-start gap-3", className)}>
      <input
        id={inputId}
        type="checkbox"
        className="mt-0.5 size-[1.15rem] shrink-0 cursor-pointer rounded-[4px] border-border-strong accent-[var(--primary)]"
        {...rest}
      />
      <span className="text-sm leading-snug">
        <span className="text-text">{label}</span>
        {description && <span className="mt-0.5 block text-muted">{description}</span>}
      </span>
    </label>
  );
}
