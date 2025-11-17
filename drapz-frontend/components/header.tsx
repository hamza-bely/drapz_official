'use client';

import Link from 'next/link';
import { ShoppingCart, Flag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <Flag className="h-6 w-6 text-blue-600" />
          <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
            Drapz
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
        </nav>
      </div>
    </header>
  );
}
