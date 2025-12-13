'use client';

import { useAuth } from '@/lib/auth-context';
import { AdminHeader } from './admin-header';
import { UserHeader } from './user-header';
import { Footer } from './footer';
import { Toaster } from './ui/toaster';
import { CartProvider } from '@/lib/cart-context';

export function AppContent({
    children,
    hideFooter = false,
}: {
    children: React.ReactNode;
    hideFooter?: boolean;
}) {
    const { isAdmin } = useAuth();

    return (
        <CartProvider>
            <div className="flex flex-col min-h-screen overflow-x-hidden">
                {isAdmin ? <AdminHeader /> : <UserHeader />}
                <main className="flex-1 w-full">
                    {children}
                </main>
                {!hideFooter && <Footer />}
            </div>
            <Toaster />
        </CartProvider>
    );
}
