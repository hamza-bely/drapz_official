"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserForm, UserFormValues } from "@/components/user-form";
import { userService } from "@/lib/services/userService";
import { SubmitHandler } from "react-hook-form";

export default function NewUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: SubmitHandler<UserFormValues> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await userService.createUser(data);
      alert("Utilisateur créé avec succès !");
      router.push("/admindrapz/utilisateurs");
    } catch (err) {
      setError("Erreur lors de la création de l'utilisateur.");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouvel utilisateur</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <UserForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
