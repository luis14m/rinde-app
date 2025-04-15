import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <img
          src="https://tlvuxyxktqqzvynbhhtu.supabase.co/storage/v1/object/public/NukleoPublico/UsoPublicoGeneral/Logo.png"
          alt="KLV Ingeniería y Construcción"
          className="h-16 w-auto mx-auto mb-6"
        />
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Sistema de Rendiciones
        </h2>

        <form className="flex flex-col min-w-64 max-w-64 mx-auto">
          <h1 className="text-2xl font-medium">Registrarse</h1>
          <p className="text-sm text text-foreground">
            Ya tiene una cuenta?{" "}
            <Link className="text-primary font-medium underline" href="/login">
              Iniciar sesion
            </Link>
          </p>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="nombre@example.com" required />
            <Label htmlFor="password">Contraseña</Label>
            <Input
              type="password"
              name="password"
              placeholder="contraseña"
              minLength={6}
              required
            />
            <SubmitButton
              formAction={signUpAction}
              pendingText="Registrando..."
            >
              Registrar
            </SubmitButton>
            <FormMessage message={searchParams} />
            <Link href={"/"} className="font-bold text-center mt-4">
              Regresar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
