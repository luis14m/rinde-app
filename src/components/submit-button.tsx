"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  type = "submit",
  variant = "default",
  className,
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={type}
      variant={variant}
      disabled={pending || props.disabled}
      className={className}
      {...props}
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : children}
    </Button>
  );
}
