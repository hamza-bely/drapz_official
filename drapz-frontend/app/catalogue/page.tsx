'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { catalogueApi } from '@/lib/api-client';
import { ProduitResponse } from '@/types/api';

function CatalogueContent() {
  const [products, setProducts] = useState<ProduitResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState<string>('nom');

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      try {
        const response = await catalogueApi.getProduits(currentPage, 12);
        if (cancelled) return;
        let items: ProduitResponse[] = response.data.content || [];

        // client-side sorting (backend doesn't expose sort in the OpenAPI)
        if (sortBy === 'prix_asc') {
          items = items.slice().sort((a, b) => a.prix - b.prix);
        } else if (sortBy === 'prix_desc') {
          items = items.slice().sort((a, b) => b.prix - a.prix);
        } else {
          items = items.slice().sort((a, b) => a.nom.localeCompare(b.nom));
        }

        setProducts(items);
        setTotalPages(response.data.totalPages ?? 0);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [currentPage, sortBy]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Notre Collection de Drapeaux</h1>
        <p className="text-lg text-slate-600">Découvrez notre sélection de drapeaux de qualité</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-64">
          <label className="text-sm font-medium mb-2 block">Trier par</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nom">Nom (A-Z)</SelectItem>
              <SelectItem value="prix_asc">Prix croissant</SelectItem>
              <SelectItem value="prix_desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-slate-600 mb-4">Aucun produit trouvé.</p>
          <Button onClick={() => setCurrentPage(0)}>Voir tous les produits</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.nom}
                description={product.description}
                price={product.prix}
                imageUrl={product.imageUrl}
                stock={product.stock}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                Page précédente
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
              >
                Page suivante
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CataloguePage() {
  return <CatalogueContent />;
}
