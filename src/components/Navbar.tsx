"use client";


import {ListFilter, PlusCircle, User2 } from 'lucide-react';
import { Button } from "./ui/button";
import { signOutAction } from "@/app/actions";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const initAuth = async () => {
      try {
        const supabase = await createSupabaseClient();

        // Get initial user
        const { data: { user: initialUser } } = await supabase.auth.getUser();
        setUser(initialUser);

        // Setup auth state listener
        const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setUser(session?.user ?? null);
          }
        );
        
        subscription = sub;
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  if (isLoading) {
    return null; // O un componente de loading
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Logo y Título */}
              <NavigationMenuItem>
                
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <img
                      src="https://tlvuxyxktqqzvynbhhtu.supabase.co/storage/v1/object/public/NukleoPublico/UsoPublicoGeneral/Logo.png"
                      alt="KLV Ingeniería y Construcción"
                      className="h-16 w-auto"
                    />
                  </NavigationMenuLink>
             
              </NavigationMenuItem>
              <NavigationMenuItem>
                
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <h1 className="text-2xl font-bold text-gray-900">Rinde-App</h1>
                  </NavigationMenuLink>
            
              </NavigationMenuItem>

              {/* Navigation Links + Auth Section */}
              {user && (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/rendiciones"
                      className={navigationMenuTriggerStyle()}
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
                    >
                      <span className="flex items-center">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Crear Rendicion
                      </span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/cuenta"
                      className={navigationMenuTriggerStyle()}
                    >
                      <span className="flex items-center">
                        <User2 className="w-4 h-4 mr-2" />
                        <span className="text-sm">Hola, {user.email}!</span>
                      </span>
                    </NavigationMenuLink>
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
