'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { AppContent } from '@/components/app-content';
import { usePathname } from 'next/navigation';


const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFooter = pathname === '/nationalite';
  
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
          <AppContent hideFooter={hideFooter}>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}