"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { productService } from "@/lib/services/productService"; // Assuming this will be updated
import { SubmitHandler } from "react-hook-form";

// Define the type for form values
type ProductFormValues = {
  nom: string;
  description: string;
  prix: number;
  stock: number;
  imageUrl: string;
};

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await productService.createProduct(data);
      alert("Produit créé avec succès !");
      router.push("/admindrapz/produits");
    } catch (err) {
      setError("Erreur lors de la création du produit.");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau produit</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
