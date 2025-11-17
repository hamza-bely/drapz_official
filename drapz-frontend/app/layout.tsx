'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <title>Drapz - Drapeaux de Qualité Supérieure</title>
        <meta name="description" content="Découvrez notre collection de drapeaux nationaux, historiques et personnalisés. Livraison rapide dans toute la France." />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CartProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
