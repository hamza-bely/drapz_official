'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import apiClient from '@/lib/api-client';
import { Card } from '@/components/ui/card';

interface DashboardStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, productsRes] = await Promise.all([
                    apiClient.get('utilisateurs'),
                    apiClient.get('produits?page=0&size=1000'),
                ]);

                const totalUsers = usersRes.data.content?.length || usersRes.data.length || 0;
                const products = productsRes.data.content || productsRes.data;
                const totalProducts = products.length || 0;
                const totalRevenue = products.reduce((sum: number, p: any) => sum + (p.prix || 0), 0);

                setStats({
                    totalUsers,
                    totalProducts,
                    totalOrders: 0, // À implémenter avec la table commandes
                    totalRevenue,
                });
            } catch (error) {
                console.error('Erreur lors du chargement des statistiques:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Chargement des statistiques...</div>;
    }

    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>
            
            {user && (
                <p className="text-gray-600 mb-6">Bienvenue, {user.email}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card Utilisateurs */}
                <Card className="p-6 bg-white shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Utilisateurs</p>
                            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalUsers}</p>
                        </div>
                        <div className="text-4xl">👥</div>
                    </div>
                </Card>

                {/* Card Produits */}
                <Card className="p-6 bg-white shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Produits</p>
                            <p className="text-4xl font-bold text-green-600 mt-2">{stats.totalProducts}</p>
                        </div>
                        <div className="text-4xl">🏷️</div>
                    </div>
                </Card>

                {/* Card Commandes */}
                <Card className="p-6 bg-white shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Commandes</p>
                            <p className="text-4xl font-bold text-orange-600 mt-2">{stats.totalOrders}</p>
                        </div>
                        <div className="text-4xl">📦</div>
                    </div>
                </Card>

                {/* Card Revenu */}
                <Card className="p-6 bg-white shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Revenu Total</p>
                            <p className="text-4xl font-bold text-purple-600 mt-2">${stats.totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="text-4xl">💰</div>
                    </div>
                </Card>
            </div>

            {/* Résumé */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-white">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Accès Rapide</h2>
                    <ul className="space-y-3 text-gray-600">
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                            Gestion des utilisateurs
                        </li>
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                            Gestion des produits
                        </li>
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                            Gestion des commandes
                        </li>
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                            Voir les statistiques détaillées
                        </li>
                    </ul>
                </Card>

                <Card className="p-6 bg-white">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Informations Système</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p><span className="font-semibold">Base de données:</span> PostgreSQL</p>
                        <p><span className="font-semibold">API:</span> http://localhost:8080/api/</p>
                        <p><span className="font-semibold">Votre rôle:</span> Administrateur</p>
                        <p><span className="font-semibold">Authentification:</span> JWT Token</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
