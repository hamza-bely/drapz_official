'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
    id: string;
    utilisateur: {
        email: string;
    };
    montantTotal: number;
    statut: string;
    createdAt: string;
    items?: any[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await apiClient.get('commandes');
                setOrders(response.data.content || response.data || []);
            } catch (error) {
                console.error('Erreur lors du chargement des commandes:', error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (statut: string) => {
        const statusMap: { [key: string]: string } = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'CONFIRMED': 'bg-blue-100 text-blue-800',
            'SHIPPED': 'bg-purple-100 text-purple-800',
            'DELIVERED': 'bg-green-100 text-green-800',
            'CANCELLED': 'bg-red-100 text-red-800',
        };
        return statusMap[statut] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return <div className="text-center py-10">Chargement des commandes...</div>;
    }

    if (orders.length === 0) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestion des Commandes</h1>
                <Card className="p-8 text-center">
                    <p className="text-gray-600">Aucune commande trouvée.</p>
                    <p className="text-sm text-gray-500 mt-2">Les commandes apparaîtront ici une fois que les clients en passeront.</p>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestion des Commandes</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id} className="p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <h3 className="font-bold text-lg text-gray-800">Commande #{order.id.slice(0, 8).toUpperCase()}</h3>
                                    <Badge className={`${getStatusColor(order.statut)}`}>
                                        {order.statut}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">Client: <span className="font-semibold">{order.utilisateur.email}</span></p>
                                <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString('fr-FR')} à {new Date(order.createdAt).toLocaleTimeString('fr-FR')}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">${order.montantTotal.toFixed(2)}</p>
                                <p className="text-xs text-gray-500 mt-1">Total TTC</p>
                            </div>
                        </div>
                        
                        {order.items && order.items.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Détails de la commande:</p>
                                <ul className="space-y-1">
                                    {order.items.map((item: any, idx: number) => (
                                        <li key={idx} className="text-sm text-gray-600">
                                            • {item.produit?.nom || 'Produit supprimé'} × {item.quantite} = ${(item.prixUnitaire * item.quantite).toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
