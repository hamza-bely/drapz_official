"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { UserForm, UserFormValues } from "@/components/user-form";
import { userService } from "@/lib/services/userService";
import { UserResponse } from "@/types/api";
import { SubmitHandler } from "react-hook-form";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id === "string") {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const data = await userService.getUserById(id);
          setUser(data);
        } catch (err) {
          setError("Utilisateur non trouvé.");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleSubmit: SubmitHandler<UserFormValues> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { motDePasse, ...userData } = data;
      const updateData = motDePasse ? data : userData;
      
      await userService.updateUser(id as string, updateData);
      alert("Utilisateur mis à jour avec succès !");
      router.push("/admindrapz/utilisateurs");
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'utilisateur.");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>Chargement de l'utilisateur...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <p>Aucun utilisateur à modifier.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Modifier l'utilisateur</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <UserForm
        initialData={user}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
