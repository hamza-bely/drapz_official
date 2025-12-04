'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { commandesApi } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CommandeDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [commande, setCommande] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      setLoading(true);
      try {
        const resp = await commandesApi.getCommande(id);
        setCommande(resp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  if (!id) return <div className="container mx-auto p-6">ID commande manquant</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Détails commande</h1>
      {loading ? (
        <p>Chargement…</p>
      ) : !commande ? (
        <Card className="p-6">Commande introuvable.</Card>
      ) : (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">Commande #{commande.id}</div>
                <div className="text-sm text-muted-foreground">{new Date(commande.createdAt).toLocaleString()}</div>
                <div className="mt-2">Statut: <strong>{commande.statut}</strong></div>
                <div className="mt-1">Montant total: <strong>{commande.montantTotal} €</strong></div>
              </div>
            </div>
          </Card>

          <div>
            <h2 className="text-lg font-semibold mb-2">Lignes de commande</h2>
            {commande.lignes && commande.lignes.length > 0 ? (
              <div className="space-y-3">
                {commande.lignes.map((l: any) => (
                  <Card key={l.id} className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{l.produitNom}</div>
                      <div className="text-sm text-muted-foreground">Quantité: {l.quantite} — Prix unitaire: {l.prixUnitaire} €</div>
                    </div>
                    <div className="text-sm font-semibold">Sous-total: {l.sousTotal} €</div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-4">Aucune ligne de commande disponible.</Card>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={() => window.history.back()} variant="outline">Retour</Button>
          </div>
        </div>
      )}
    </div>
  );
}
