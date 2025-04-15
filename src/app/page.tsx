import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <nav className="bg-white shadow-md px-4">
      <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <Image
            src="https://tlvuxyxktqqzvynbhhtu.supabase.co/storage/v1/object/public/NukleoPublico/UsoPublicoGeneral/Logo.png"
            alt="KLV Ingeniería y Construcción"
            width={64}
            height={64}
            className="h-16 w-auto"
          />
          <div className="h-12 w-px bg-gray-200" />
          <h1 className="text-2xl font-bold text-gray-900">RindeApp</h1>
        </div>

        <div className="flex gap-10 items-center">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="hover:opacity-50"
          >
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="hover:opacity-50"
          >
            <Link href="/sign-up">Registrarse</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
