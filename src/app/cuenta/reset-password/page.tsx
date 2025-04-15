import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <Image
          src="https://tlvuxyxktqqzvynbhhtu.supabase.co/storage/v1/object/public/NukleoPublico/UsoPublicoGeneral/Logo.png"
          alt="KLV Ingeniería y Construcción"
          width={64}
          height={64}
          className="h-16 w-auto"
        />
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Sistema de Rendiciones
        </h2>
        <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
          <h1 className="text-2xl font-medium">Reset password</h1>
          <p className="text-sm text-foreground/60">
            Por favor ingresa un nuevo password.
          </p>
          <Label htmlFor="password">New password</Label>
          <Input
            type="password"
            name="password"
            placeholder="New password"
            required
          />
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            required
          />
          <SubmitButton formAction={resetPasswordAction}>
            Reset password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </form>
      </div>
    </main>
  );
}
