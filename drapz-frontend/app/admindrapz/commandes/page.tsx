"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/lib/services/orderService";
import { CommandeResponse } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<CommandeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderStatuses = ["EN_ATTENTE", "CONFIRMEE", "EXPEDIEE", "LIVREE", "ANNULEE", "REMBOURSEE"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const orderData = await orderService.getOrders();
        setOrders(orderData);
        setError(null);
      } catch (err) {
        setError("Impossible de charger les commandes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
      alert("Statut de la commande mis à jour.");
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut.");
      console.error(error);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "LIVREE":
        return "success";
      case "ANNULEE":
      case "REMBOURSEE":
        return "destructive";
      case "EXPEDIEE":
        return "secondary";
      default:
        return "default";
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des commandes</h1>

      <div className="bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono">
                  <Link href={`/admindrapz/commandes/${order.id}`} className="hover:underline">
                    {order.id.substring(0, 8)}...
                  </Link>
                </TableCell>
                <TableCell>{order.utilisateur.prenom} {order.utilisateur.nom}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{order.montantTotal.toFixed(2)} €</TableCell>
                <TableCell>
                  <Badge >{order.statut}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Changer le statut</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {orderStatuses.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => handleStatusChange(order.id, status)}
                          disabled={order.statut === status}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}