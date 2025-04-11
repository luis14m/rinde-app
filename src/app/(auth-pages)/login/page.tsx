import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  
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
          <h1 className="text-2xl font-medium">Iniciar sesion</h1>
          <p className="text-sm text-foreground">
            No tienes una cuenta?{" "}
            <Link
              className="text-foreground font-medium underline"
              href="/sign-up"
            >
              Registrarse
            </Link>
          </p>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="nombre@example.com" required />
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Contraseña</Label>
              <Link
                className="text-xs text-foreground underline"
                href="/forgot-password"
              >
                Olvidó su contraseña?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="Contraseña"
              required
            />
            <SubmitButton pendingText="Iniciando..." formAction={signInAction}>
              Iniciar sesion
            </SubmitButton>
            <FormMessage message={searchParams} />
            <div className="w-full flex justify-center">
              <Link 
                href={"/"} 
                className="font-bold text-center mt-4 hover:text-gray-600 transition-colors duration-200 px-4 py-2"
              >
                Regresar
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
