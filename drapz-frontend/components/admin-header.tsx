"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function AdminHeader() {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <nav className="hidden lg:flex items-center gap-6 flex-1 mx-8">
            <Link href="/admindrapz/dashboard" className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap">
              Dashboard
            </Link>
            <Link href="/admindrapz/produits" className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap">
              Gestion des produits
            </Link>

            <Link href="/admindrapz/utilisateurs" className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap">
              Gestion des utilisateurs
            </Link>
            <Link href="/admindrapz/commandes" className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap">
              Gestion des commandes
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-sm"
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
