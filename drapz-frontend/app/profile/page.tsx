'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { commandesApi } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Adresse {
  ligne1: string;
  ville: string;
  codePostal: string;
  pays: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
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
      alert('Adresse enregistrée');
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto min-h-[60vh] flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Vous devez vous connecter</h2>
          <p className="mb-4 text-sm text-muted-foreground">Connectez-vous pour voir votre profil et vos commandes.</p>
          <Link href="/auth/login">
            <Button>Se connecter</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Informations personnelles</h2>
          <p><strong>Prénom:</strong> {user.prenom}</p>
          <p><strong>Nom:</strong> {user.nom}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <div className="mt-4">
            <Link href="/auth/register">
              <Button variant="outline">Modifier mes informations</Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Adresse de livraison</h2>
          <div className="space-y-2">
            <input className="w-full border rounded px-2 py-2" placeholder="Adresse ligne 1" value={address.ligne1} onChange={(e) => setAddress({ ...address, ligne1: e.target.value })} />
            <input className="w-full border rounded px-2 py-2" placeholder="Ville" value={address.ville} onChange={(e) => setAddress({ ...address, ville: e.target.value })} />
            <input className="w-full border rounded px-2 py-2" placeholder="Code postal" value={address.codePostal} onChange={(e) => setAddress({ ...address, codePostal: e.target.value })} />
            <input className="w-full border rounded px-2 py-2" placeholder="Pays" value={address.pays} onChange={(e) => setAddress({ ...address, pays: e.target.value })} />
            <div className="flex gap-2 mt-3">
              <Button onClick={saveAddress}>Enregistrer l'adresse</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Commande rapide</h2>
          <p className="text-sm">Lien rapide vers votre panier et historique.</p>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/panier">
              <Button>Voir mon panier</Button>
            </Link>
            <Link href="/catalogue">
              <Button variant="outline">Continuer mes achats</Button>
            </Link>
          </div>
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Mes commandes</h2>
        {loadingOrders ? (
          <p>Chargement...</p>
        ) : orders.length === 0 ? (
          <Card className="p-6">Vous n'avez encore passé aucune commande.</Card>
        ) : (
          <div className="space-y-4">
            {orders.map((commande: any) => (
              <Card key={commande.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Commande #{commande.id}</div>
                    <div className="text-sm text-muted-foreground">{new Date(commande.createdAt).toLocaleString()}</div>
                    <div className="mt-2 text-sm">Statut: <strong>{commande.statut}</strong></div>
                    <div className="mt-1 text-sm">Montant total: <strong>{commande.montantTotal} €</strong></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href={`/commande/${commande.id}`}>
                      <Button variant="ghost">Voir</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
