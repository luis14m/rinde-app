"use client";

import Link from "next/link";
import { CircleDollarSign, ListFilter, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { signOutAction } from "@/app/actions";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const supabase = await createSupabaseClient();

      // Get initial user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    };

    initAuth();
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Logo y Título */}
              <NavigationMenuItem>
                <Link href="http://www.klv.cl" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <img
                      src="https://tlvuxyxktqqzvynbhhtu.supabase.co/storage/v1/object/public/NukleoPublico/UsoPublicoGeneral/Logo.png"
                      alt="KLV Ingeniería y Construcción"
                      className="h-16 w-auto"
                    />
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <h1 className="text-2xl font-bold text-gray-900">RindeApp</h1>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* Navigation Links + Auth Section */}
              {user && (
                <>
                  <NavigationMenuItem>
                    <Link href="/rendiciones" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <ListFilter className="w-4 h-4 mr-2" />
                        Ver Transacciones
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/nuevo" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Crear Rendicion
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                 

                  <NavigationMenuItem>
                    <Link href="/cuenta" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <span className="text-sm">
                          Hola, {user.email}!
                        </span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <form action={signOutAction}>
                      <Button type="submit" variant="outline" size="sm">
                        Cerrar sesion
                      </Button>
                    </form>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
