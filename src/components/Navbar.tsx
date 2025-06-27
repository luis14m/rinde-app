import { ListFilter, PlusCircle, User2, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

import { LogoutButton } from "./logout-button";

import Logo from "./logo-imagen";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-6">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo width={64} height={64} />
              {/*  <div className="h-16 w-px bg-gray-200" /> */}
              <h1 className="text-2xl font-bold">Rinde App</h1>
            </Link>
          </div>

          <NavigationMenu>
            <NavigationMenuList className="flex flex-col md:flex-row space-y-2 md:space-y-0 p-4 md:p-0">
              {user ? (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/"
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
                      href="/expenses/create"
                      className={navigationMenuTriggerStyle()}
                    >
                      <span className="flex items-center">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Crear Transaccion
                      </span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/profile"
                      className={navigationMenuTriggerStyle()}
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
            {/* <ModeToggle /> */}
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
