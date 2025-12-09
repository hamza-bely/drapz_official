'use client';

import { useAdminRoute } from '@/hooks/use-admin-route';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAdmin, loading } = useAdminRoute();

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-gray-800">Drapz Admin</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin/dashboard">
                        <Button variant="ghost" className="w-full justify-start">
                            📊 Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/users">
                        <Button variant="ghost" className="w-full justify-start">
                            👥 Gestion Utilisateurs
                        </Button>
                    </Link>
                    <Link href="/admin/products">
                        <Button variant="ghost" className="w-full justify-start">
                            🏷️ Gestion Produits
                        </Button>
                    </Link>
                    <Link href="/admin/orders">
                        <Button variant="ghost" className="w-full justify-start">
                            📦 Gestion Commandes
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start mt-6">
                            ← Retour au site
                        </Button>
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
