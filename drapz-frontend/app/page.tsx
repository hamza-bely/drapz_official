'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Package, Truck, Shield, Star } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { catalogueApi } from '@/lib/api-client';
import { ProduitResponse } from '@/types/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ProduitResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await catalogueApi.getProduits(0, 4);
        setFeaturedProducts(response.data.content);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des produits mis en avant:', error);
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="flex flex-col">
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-red-50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Des <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">Drapeaux de Qualité</span> pour Toutes les Occasions
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              Découvrez notre collection exclusive de drapeaux nationaux, historiques et personnalisés. Fabrication de haute qualité, livraison rapide partout en France.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/catalogue">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8">
                  Voir le catalogue
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/catalogue?category=drapeaux-personnalises">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  Créer un drapeau
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Qualité Premium</h3>
              <p className="text-sm text-slate-600">Matériaux résistants aux intempéries</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Livraison Rapide</h3>
              <p className="text-sm text-slate-600">Expédition sous 24-48h</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Paiement Sécurisé</h3>
              <p className="text-sm text-slate-600">Transactions 100% sécurisées</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Satisfaction Client</h3>
              <p className="text-sm text-slate-600">Plus de 1000 clients satisfaits</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Meilleures Ventes</h2>
            <p className="text-lg text-slate-600">Découvrez les drapeaux préférés de nos clients</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-96 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product) => (
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
          )}

          <div className="text-center">
            <Link href="/catalogue">
              <Button size="lg" variant="outline" className="gap-2">
                Voir tous les produits
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Besoin d'un Drapeau Personnalisé ?</h2>
            <p className="text-lg text-blue-100 leading-relaxed">
              Créez votre propre drapeau avec votre logo, vos couleurs ou votre message.
              Parfait pour les événements, les entreprises ou les cadeaux uniques.
            </p>
            <Link href="/catalogue?category=drapeaux-personnalises">
              <Button size="lg" variant="secondary" className="gap-2">
                Commencer ma création
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
