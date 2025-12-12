"use client";

import { useEffect, useState } from "react";
import { userService } from "@/lib/services/userService";
import { UserResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const userData = await userService.getUsers();
        setUsers(userData);
        setError(null);
      } catch (err) {
        setError("Impossible de charger les utilisateurs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter((u) => u.id !== id));
        alert("Utilisateur supprimé avec succès.");
      } catch (error) {
        alert("Erreur lors de la suppression de l'utilisateur.");
        console.error(error);
      }
    }
  };

  if (loading) {
    return <p>Chargement des utilisateurs...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <Button asChild>
          <Link href="/admindrapz/utilisateurs/nouveau">
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un utilisateur
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.nom} {user.prenom}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admindrapz/utilisateurs/modifier/${user.id}`}>
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-600">
                        Supprimer
                      </DropdownMenuItem>
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