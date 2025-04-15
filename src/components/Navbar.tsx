"use client";

import { ListFilter, PlusCircle, User2 } from "lucide-react";
import { Button } from "./ui/button";
import { signOutAction } from "@/app/actions";
import { User } from "@supabase/supabase-js";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";


export default function Navbar() {
 

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Image
                  src="https://tlvuxyxktqqzvynbhhtu.supabase.co/storage/v1/object/public/NukleoPublico/UsoPublicoGeneral/Logo.png"
                  alt="KLV Ingeniería y Construcción"
                  width={64}
                  height={64}
                  className="h-16 w-auto"
                  priority
                />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Rinde-App
                  </h1>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Navigation Links + Auth Section */}
          
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
                        <span className="text-sm">
                          {"Cuenta"}
                        </span>
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
             
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}




