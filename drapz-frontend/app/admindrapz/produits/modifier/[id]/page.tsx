"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { productService } from "@/lib/services/productService";
import { ProduitResponse } from "@/types/api";
import { SubmitHandler } from "react-hook-form";

type ProductFormValues = {
  nom: string;
  description: string;
  prix: number;
  stock: number;
  imageUrl: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState<ProduitResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id === "string") {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const data = await productService.getProductById(id);
          setProduct(data);
        } catch (err) {
          setError("Produit non trouvé.");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await productService.updateProduct(id as string, data);
      alert("Produit mis à jour avec succès !");
      router.push("/admindrapz/produits");
    } catch (err) {
      setError("Erreur lors de la mise à jour du produit.");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>Chargement du produit...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!product) {
    return <p>Aucun produit à modifier.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Modifier le produit</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
