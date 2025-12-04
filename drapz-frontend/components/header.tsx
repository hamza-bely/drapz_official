'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';

export function Header() {
  const { totalItems } = useCart();
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { href: '/catalogue', label: 'Catalogue' },
    { href: '/catalogue?category=drapeaux-nationaux', label: 'Nationaux' },
    { href: '/catalogue?category=drapeaux-personnalises', label: 'Personnalisés' },
    { href: '/nationalite', label: 'Nationalités' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg md:text-xl hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="relative w-10 h-10">
              <Image
                src="/media/oie_transparent.png"
                alt="Logo Drapz"
                fill
                className="object-contain"
              />
            </div>
            <span className="hidden sm:inline text-lg font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">Drapz</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 flex-1 mx-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {!loading && user ? (
              <>
                <Link href="/profile" className="text-sm font-medium hover:text-blue-600 transition-colors">
                  Profil
                </Link>
                <Link href="/panier">
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-sm"
                >
                  Déconnexion
                </Button>
              </>
            ) : !loading ? (
              <>
                <Link href="/auth/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="text-sm font-medium hover:text-blue-600 transition-colors">
                  Register
                </Link>
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link href="/panier">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden border-t pb-4 space-y-1 animate-in fade-in slide-in-from-top-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            <div className="border-t my-2" />

            {!loading && user ? (
              <>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 Profil
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition-colors text-red-600"
                >
                  🚪 Déconnexion
                </button>
              </>
            ) : !loading ? (
              <>
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : null}
          </nav>
        )}
      </div>
    </header>
  );
}
