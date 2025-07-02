"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Enviando...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      variant="default" 
      aria-disabled={pending} 
      {...props}
      className="bg-blue-600 hover:bg-blue-700 text-white">
      {pending ? pendingText : children}
    </Button>
  );
}