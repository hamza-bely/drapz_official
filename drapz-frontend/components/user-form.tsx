"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserResponse } from "@/types/api";

const userSchema = z.object({
  nom: z.string().min(2, "Le nom est requis."),
  prenom: z.string().min(2, "Le prénom est requis."),
  email: z.string().email("L'email n'est pas valide."),
  role: z.enum(["USER", "ADMIN"]),
  motDePasse: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères.").optional().or(z.literal('')),
});

export type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: UserResponse;
  onSubmit: SubmitHandler<UserFormValues>;
  isSubmitting: boolean;
}

export function UserForm({ initialData, onSubmit, isSubmitting }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      nom: "",
      prenom: "",
      email: "",
      role: "USER",
      motDePasse: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" {...register("nom")} />
          {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
        </div>
        <div>
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" {...register("prenom")} />
          {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="role">Rôle</Label>
        <Select onValueChange={(value) => register("role").onChange({ target: { value } })} defaultValue={initialData?.role || "USER"}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">Utilisateur</SelectItem>
            <SelectItem value="ADMIN">Administrateur</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
      </div>
      <div>
        <Label htmlFor="motDePasse">Mot de passe</Label>
        <Input id="motDePasse" type="password" {...register("motDePasse")} placeholder={initialData ? "Laisser vide pour ne pas changer" : ""} />
        {errors.motDePasse && <p className="text-red-500 text-sm mt-1">{errors.motDePasse.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : (initialData ? "Mettre à jour" : "Créer l'utilisateur")}
      </Button>
    </form>
  );
}
