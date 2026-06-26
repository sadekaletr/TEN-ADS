"use client";

import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";

type FormControlProps = {
  id?: string;
  error?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  const autoId = useId();
  const fieldId = htmlFor ?? autoId;
  const errorId = `${fieldId}-error`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const describedBy =
    [hintId, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  const control = isValidElement<FormControlProps>(children)
    ? cloneElement(children as ReactElement<FormControlProps>, {
        id: children.props.id ?? fieldId,
        error: error ? true : children.props.error,
        "aria-invalid": error ? true : children.props["aria-invalid"],
        "aria-describedby": describedBy ?? children.props["aria-describedby"],
      })
    : children;

  return (
    <div className={cn("space-y-1", className)}>
      <Label htmlFor={fieldId}>
        {label}
        {required ? (
          <span className="text-gold-3" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </Label>
      {control}
      {hint ? (
        <p id={hintId} className="text-xs text-dimmer">
          {hint}
        </p>
      ) : null}
      {error ? (
        <FieldError id={errorId} role="alert">
          {error}
        </FieldError>
      ) : null}
    </div>
  );
}
