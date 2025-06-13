"use client";

import { ListFilter, PlusCircle, User2, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogoutButton } from "./logout-button";
import { ModeToggle } from "./ui/mode-toggle";

export default async function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    let supabase: any;
    const getUser = async () => {
      supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      // Suscribirse a cambios de sesión
      supabase.auth.onAuthStateChange((_event: string, session: any) => {
        setUser(session?.user || null);
        // Recargar la página si hay login/logout
        router.refresh();
      });
    };
    getUser();
    // Limpieza opcional
    return () => {
      // No hay método de unsuscribe directo en supabase-js v2 para onAuthStateChange
    };
  }, [router]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex h-16 items-center justify-between">
        <div className="mr-4 hidden md:flex items-center">
          <Image
            src="https://tlvuxyxktqqzvynbhhtu.supabase.co/storage/v1/object/public/NukleoPublico/UsoPublicoGeneral/Logo.png"
            alt="KLV Ingeniería y Construcción"
            width={64}
            height={64}
            className="h-16 w-auto"
            priority
          />
          <h1 className="text-2xl font-bold text-gray-900 ml-2">Rinde-App</h1>
        </div>

        {/* Botón de menú móvil */}
        <button
          className="md:hidden p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menú de navegación */}
        <div
          className={`
          absolute top-16 left-0 w-full bg-white md:static md:w-auto md:bg-transparent
          ${isOpen ? "block" : "hidden"} md:block
          transition-all duration-300 ease-in-out
        `}
        >
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col md:flex-row space-y-2 md:space-y-0 p-4 md:p-0">
              {user ? (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/rendiciones"
                      className={navigationMenuTriggerStyle()}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center">
                        <ListFilter className="w-4 h-4 mr-2" />
                        Ver Transacciones
                      </span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/nuevo"
                      className={navigationMenuTriggerStyle()}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Nueva Transaccion
                      </span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/cuenta"
                      className={navigationMenuTriggerStyle()}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="flex items-center">
                        <User2 className="w-4 h-4 mr-2" />
                        <span className="text-sm">Cuenta</span>
                      </span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <LogoutButton />
                  </NavigationMenuItem>
                 
                </>
              ) : (
                <NavigationMenuItem>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm" className="w-full">
                      Iniciar sesión
                    </Button>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
            <ModeToggle />
          </NavigationMenu>
       
        </div>
      </div>
    </header>
  );
}
