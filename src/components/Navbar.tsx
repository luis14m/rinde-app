import { ListFilter, PlusCircle, User2, Menu, X, LayoutDashboard, User } from "lucide-react";
import { Button } from "./ui/button";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";


import { LogoutButton } from "./logout-button";

import Logo from "./logo-imagen";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { getUserAndProfile } from "@/app/profile/actions";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./ui/mode-toggle";

export default async function Navbar() {
  // Obtener usuario y perfil en el server
  const { user, profile } = await getUserAndProfile();
  
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
                  </NavigationMenuList>
                  </NavigationMenu>
                  
              <nav className="flex justify-between items-center space-x-4">
              {/* */}
              {/* Botón para crear nuevo post (solo si hay usuario) */}
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url}
                          alt={user.email}
                        />
                        <AvatarFallback>
                          {user.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {profile?.name ||
                            user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {profile?.email || user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <LogoutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/login">Login</Link>
                </Button>
              )}
              {/* <ModeToggle /> */}
            </nav>
        </div>
      </div>
    </nav>
  );
}
