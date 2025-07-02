"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { forgotPasswordAction } from "@/app/auth/actions";
import { SubmitButton } from "@/components/submit-button";

export default function ForgotPasswordForm({
  className,
  searchParams, // destructured, will not be included in ...props
  ...props
}: Omit<React.ComponentPropsWithoutRef<"div">, "searchParams"> & { searchParams?: any }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      {success ? (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Revisa tu correo</CardTitle>
            <CardDescription>
              Instrucciones para restablecer la contraseña enviadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Si te registraste usando tu correo y contraseña, recibirás un
              email para restablecer tu contraseña.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Resetablecer tu Password</CardTitle>
            <CardDescription>
              Escribe tu correo electrónico y te enviaremos un enlace para
              restablecer tu contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <SubmitButton formAction={forgotPasswordAction}>
                  Restablecer contraseña
                </SubmitButton>
              </div>
              <div className="mt-4 text-center text-sm">
                Ya tienes una cuenta?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Iniciar sesion
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
