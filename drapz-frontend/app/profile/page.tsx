'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { commandesApi } from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface Adresse {
  ligne1: string;
  ville: string;
  codePostal: string;
  pays: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [address, setAddress] = useState<Adresse>({ ligne1: '', ville: '', codePostal: '', pays: '' });

  useEffect(() => {
    // Load address from localStorage (simple local fallback)
    try {
      const raw = localStorage.getItem('shippingAddress');
      if (raw) setAddress(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const resp = await commandesApi.getMesCommandes(0, 20);
        // API may return paginated content or an array
        const data = resp.data;
        setOrders(data.content ?? data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  const saveAddress = () => {
    try {
      localStorage.setItem('shippingAddress', JSON.stringify(address));
      toast({
        title: 'Succès',
        description: 'Adresse enregistrée',
      });
    } catch (e) {
      console.error(e);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'enregistrement',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
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
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Mon Profil</h1>
        <p className="text-slate-600 text-sm md:text-base">
          Bienvenue {user.prenom} {user.nom} 👋
        </p>
      </div>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
        {/* Personal Information */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              👤 Informations personnelles
            </h2>
            <div className="space-y-2 text-sm md:text-base">
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
            {/* <div className="mt-4">
              <Link href="/auth/register">
                <Button variant="outline" size="sm" className="w-full">
                  Modifier mes informations
                </Button>
              </Link>
            </div> */}
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📍 Adresse de livraison
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs md:text-sm font-medium text-slate-700">Adresse</label>
                <Input
                  type="text"
                  placeholder="123 Rue de la Paix"
                  value={address.ligne1}
                  onChange={(e) => setAddress({ ...address, ligne1: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs md:text-sm font-medium text-slate-700">Ville</label>
                  <Input
                    type="text"
                    placeholder="Paris"
                    value={address.ville}
                    onChange={(e) => setAddress({ ...address, ville: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-slate-700">Code postal</label>
                  <Input
                    type="text"
                    placeholder="75000"
                    value={address.codePostal}
                    onChange={(e) => setAddress({ ...address, codePostal: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-slate-700">Pays</label>
                <Input
                  type="text"
                  placeholder="France"
                  value={address.pays}
                  onChange={(e) => setAddress({ ...address, pays: e.target.value })}
                  className="mt-1"
                />
              </div>
              <Button onClick={saveAddress} size="sm" className="w-full h-9 md:h-10">
                💾 Enregistrer l'adresse
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🛒 Actions rapides
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mb-4">
              Accédez rapidement à votre panier et vos commandes.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/panier">
                <Button variant="default" size="sm" className="w-full">
                  Voir mon panier
                </Button>
              </Link>
              <Link href="/catalogue">
                <Button variant="outline" size="sm" className="w-full">
                  Continuer mes achats
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Section */}
      <section>
        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">📦 Mes commandes</h2>
        {loadingOrders ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-slate-600">Chargement de vos commandes...</p>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-slate-600">Vous n'avez encore passé aucune commande.</p>
              <Link href="/catalogue">
                <Button className="mt-4">Commencer vos achats</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {orders.map((commande: any) => (
              <Card key={commande.id} className="overflow-hidden">
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
                      <span className="text-xs md:text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                        {commande.statut}
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
