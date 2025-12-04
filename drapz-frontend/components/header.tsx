'use client';

import Link from 'next/link';
import { ShoppingCart, Flag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Header() {
  const { totalItems } = useCart();

  const { user, logout, loading } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
            <Image src="/media/oie_transparent.png"
                   alt="Logo Drapz"
                   width={100}
                   height={100}
            />
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/catalogue" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Catalogue
          </Link>
          <Link href="/catalogue?category=drapeaux-nationaux" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Nationaux
          </Link>
          <Link href="/catalogue?category=drapeaux-historiques" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Historiques
          </Link>
          <Link href="/catalogue?category=drapeaux-thematiques" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Thématiques
          </Link>
          <Link href="/catalogue?category=drapeaux-personnalises" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Personnalisés
          </Link>
        </nav>

        {loading ? (
          <div className="hidden md:flex items-center gap-3">
            {/* Show nothing or a skeleton while loading */}
          </div>
        ) : user ? (
          <div className="hidden md:flex items-center gap-3">
            <Link href="/profile" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Profil
            </Link>

            <Link href="/panier">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <Button variant="ghost" onClick={logout} className="text-sm hidden md:inline">
              Déconnexion
            </Button>
          </div>
        ) : (
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/auth/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link href="/auth/register" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Regsiter
            </Link>
          </nav>
        )}

      </div>

      <div className="md:hidden border-t">
        <nav className="container mx-auto flex items-center gap-4 px-4 py-2 overflow-x-auto">
          <Link href="/catalogue" className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap">
            Catalogue
          </Link>
          <Link href="/catalogue?category=drapeaux-nationaux" className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap">
            Nationaux
          </Link>
          <Link href="/catalogue?category=drapeaux-historiques" className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap">
            Historiques
          </Link>
          <Link href="/catalogue?category=drapeaux-thematiques" className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap">
            Thématiques
          </Link>
          <Link href="/catalogue?category=drapeaux-personnalises" className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap">
            Personnalisés
          </Link>
          {!loading && user ? (
            <>
              <Link href="/profile" className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap">
                Profil
              </Link>
              <Link href="/panier" className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap flex items-center">
                <ShoppingCart className="h-4 w-4 mr-1" /> Panier
                {totalItems > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>
            </>
          ) : !loading ? (
            <>
              <Link href="/auth/login" className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap">
                Login
              </Link>
              <Link href="/auth/register" className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap">
                Register
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
