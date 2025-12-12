"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { orderService } from "@/lib/services/orderService";
import { CommandeResponse } from "@/types/api";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailPage() {
  const params = useParams();
  const { id } = params;
  const [order, setOrder] = useState<CommandeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id === "string") {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const orderData = await orderService.getOrderById(id);
          setOrder(orderData);
          setError(null);
        } catch (err) {
          setError("Impossible de charger la commande.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!order) {
    return <p>Commande non trouvée.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Détails de la commande</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations client</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Nom:</strong> {order.utilisateur.prenom} {order.utilisateur.nom}</p>
            <p><strong>Email:</strong> {order.utilisateur.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Informations commande</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>ID:</strong> <span className="font-mono">{order.id}</span></p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Montant Total:</strong> {order.montantTotal.toFixed(2)} €</p>
            <p><strong>Statut:</strong> <Badge>{order.statut}</Badge></p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles commandés</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Prix unitaire</TableHead>
                <TableHead className="text-right">Sous-total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.lignes.map((ligne) => (
                <TableRow key={ligne.id}>
                  <TableCell>{ligne.produitNom}</TableCell>
                  <TableCell>{ligne.quantite}</TableCell>
                  <TableCell>{ligne.prixUnitaire.toFixed(2)} €</TableCell>
                  <TableCell className="text-right">{ligne.sousTotal.toFixed(2)} €</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
