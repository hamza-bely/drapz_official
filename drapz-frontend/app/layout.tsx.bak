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
    <html lang="fr" className="scroll-smooth">
      <head>
        <title>Drapz - Drapeaux de Qualité Supérieure</title>
        <meta name="description" content="Découvrez notre collection de drapeaux nationaux, historiques et personnalisés. Livraison rapide dans toute la France." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={`${inter.className} antialiased bg-white text-foreground`}>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen overflow-x-hidden">
              {/* Header - Sticky */}
              <Header />
              
              {/* Main Content - Flex grows */}
              <main className="flex-1 w-full">
                {children}
              </main>
              
              {/* Footer */}
              <Footer />
            </div>
          </CartProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
