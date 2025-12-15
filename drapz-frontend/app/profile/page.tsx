'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { orderService } from '@/lib/services';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Hand, Package, User } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!user) return;

            const fetchOrders = async () => {
                setLoadingOrders(true);
                try {
                    const resp = await orderService.getUserOrders(0, 20);
                    setOrders(resp.content);
                } catch (err) {
                    console.error('Failed to fetch orders', err);
                } finally {
                    setLoadingOrders(false);
                }
            };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center animate-in fade-in zoom-in-95">
          <h2 className="text-xl font-semibold mb-2">Vous devez vous connecter</h2>
          <p className="mb-4 text-sm text-slate-600">
            Connectez-vous pour voir votre profil et vos commandes.
          </p>
          <Link href="/auth/login">
            <Button className="w-full">Se connecter</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-in fade-in">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-2">
          Mon Profil
        </h1>
        <p className="text-slate-600 text-sm md:text-base flex items-center gap-2">
          Bienvenue {user.prenom} {user.nom} <Hand className="inline-block h-5 w-5 text-yellow-500" />
        </p>
      </div>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
        {/* Personal Information */}
        <Card className="col-span-1 lg:col-span-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" /> Informations personnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm md:text-base">
              <div>
                <span className="font-medium text-slate-600">Prénom:</span>
                <p className="text-slate-800">{user.prenom}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Nom:</span>
                <p className="text-slate-800">{user.nom}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Email:</span>
                <p className="text-slate-800 break-all">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 flex items-center gap-2">
          <Package className="h-6 w-6 text-blue-600" /> Mes commandes
        </h2>
        {loadingOrders ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-slate-600">Chargement de vos commandes...</p>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-slate-600 mb-4">Vous n'avez encore passé aucune commande.</p>
              <Link href="/catalogue">
                <Button>Commencer vos achats</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {orders.map((commande: any, index: number) => (
              <Card
                key={commande.id}
                className="overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${150 + index * 100}ms` }}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-sm md:text-base">
                          Commande #{commande.id.substring(0, 8)}
                        </div>
                        <div className="text-xs md:text-sm text-slate-600">
                          {new Date(commande.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <span
                        className={`text-xs md:text-sm font-semibold px-3 py-1 rounded-full ${
                          commande.statut === 'CONFIRMEE'
                            ? 'bg-green-100 text-green-700'
                            : commande.statut === 'ANNULEE' || commande.statut === 'REMBOURSEE'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {
                          commande.statut === 'EN_ATTENTE' ? 'En attente' :
                          commande.statut === 'CONFIRMEE' ? 'Confirmée' :
                          commande.statut === 'EXPEDIEE' ? 'Expédiée' :
                          commande.statut === 'LIVREE' ? 'Livrée' :
                          commande.statut === 'ANNULEE' ? 'Annulée' :
                          commande.statut === 'REMBOURSEE' ? 'Remboursée' :
                          commande.statut
                        }
                      </span>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center text-sm md:text-base">
                        <span className="text-slate-600">Montant:</span>
                        <span className="font-bold text-blue-600">{commande.montantTotal.toFixed(2)} €</span>
                      </div>
                    </div>

                    <Link href={`/commande/${commande.id}`}>
                      <Button variant="outline" size="sm" className="w-full h-8 md:h-9">
                        Voir les détails
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
