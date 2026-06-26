import { Button, type ButtonProps } from "./Button";

export function SecondaryButton({ variant: _v, ...props }: ButtonProps) {
  return <Button variant="secondary" {...props} />;
}
