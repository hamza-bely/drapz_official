"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProduitResponse } from "@/types/api";

const productSchema = z.object({
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères."),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères."),
  prix: z.coerce.number().min(0, "Le prix doit être un nombre positif."),
  stock: z.coerce.number().int().min(0, "Le stock doit être un entier positif."),
  imageUrl: z.string().url("L'URL de l'image n'est pas valide."),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: ProduitResponse;
  onSubmit: SubmitHandler<ProductFormValues>;
  isSubmitting: boolean;
}

export function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      nom: "",
      description: "",
      prix: 0,
      stock: 0,
      imageUrl: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Label htmlFor="nom">Nom du produit</Label>
        <Input id="nom" {...register("nom")} />
        {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="prix">Prix (€)</Label>
          <Input id="prix" type="number" step="0.01" {...register("prix")} />
          {errors.prix && <p className="text-red-500 text-sm mt-1">{errors.prix.message}</p>}
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock")} />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="imageUrl">URL de l'image</Label>
        <Input id="imageUrl" {...register("imageUrl")} />
        {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement..." : (initialData ? "Mettre à jour" : "Créer le produit")}
      </Button>
    </form>
  );
}
