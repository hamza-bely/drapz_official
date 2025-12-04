'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { catalogueApi } from '@/lib/api-client';
import { ProduitResponse } from '@/types/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function CatalogueContent() {
  const [products, setProducts] = useState<ProduitResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState<string>('nom');
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      try {
        const response = await catalogueApi.getProduits(currentPage, itemsPerPage);
        if (cancelled) return;
        let items: ProduitResponse[] = response.data.content || [];

        // client-side sorting
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
  }, [currentPage, sortBy, itemsPerPage]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">
          Notre Collection de Drapeaux
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Découvrez notre sélection de drapeaux de qualité
        </p>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-end">
        <div className="w-full sm:w-64">
          <label className="text-sm font-medium mb-2 block">Trier par</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nom">Nom (A-Z)</SelectItem>
              <SelectItem value="prix_asc">Prix croissant</SelectItem>
              <SelectItem value="prix_desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Page indicator */}
        <div className="text-sm text-slate-600">
          Page {currentPage + 1} sur {totalPages}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(itemsPerPage)].map((_, i) => (
            <div key={i} className="h-80 md:h-96 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-slate-600 mb-4">Aucun produit trouvé.</p>
          <Button onClick={() => setCurrentPage(0)}>Voir tous les produits</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="w-full sm:w-auto gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédente
              </Button>

              <span className="text-sm text-slate-600">
                Page {currentPage + 1} de {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="w-full sm:w-auto gap-2"
              >
                Suivante
                <ChevronRight className="h-4 w-4" />
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
