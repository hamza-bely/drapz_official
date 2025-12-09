'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center">
        <ShoppingBag className="h-16 w-16 md:h-20 md:w-20 mx-auto text-slate-300 mb-4 md:mb-6" />
        <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Votre panier est vide</h1>
        <p className="text-slate-600 mb-6 md:mb-8 text-sm md:text-base">
          Découvrez notre collection de drapeaux de qualité
        </p>
        <Link href="/catalogue">
          <Button size="lg" className="w-full sm:w-auto">Voir le catalogue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
        Panier ({totalItems} article{totalItems > 1 ? 's' : ''})
      </h1>

      {/* Desktop & Mobile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Products List */}
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          {items.map((item) => (
            <Card key={item.product.id} className="overflow-hidden">
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-24 md:w-28 h-40 sm:h-24 md:h-28 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <Link href={`/produit/${item.product.id}`}>
                        <h3 className="font-semibold text-base md:text-lg mb-1 hover:text-blue-600 transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="font-semibold text-blue-600 text-lg">
                        {item.product.price.toFixed(2)} €
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-between items-start sm:items-center mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-lg bg-slate-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 md:h-9 md:w-9"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </Button>
                        <span className="px-2 md:px-3 font-medium text-sm md:text-base">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 md:h-9 md:w-9"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </Button>
                      </div>

                      {/* Subtotal & Delete */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                        <span className="font-semibold text-blue-600">
                          {(item.product.price * item.quantity).toFixed(2)} €
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 md:h-9 md:w-9 p-0"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 md:top-20">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h2 className="text-lg md:text-xl font-semibold">Récapitulatif</h2>

              <div className="space-y-2 pt-4 border-t text-sm md:text-base">
                <div className="flex justify-between">
                  <span className="text-slate-600">Sous-total</span>
                  <span className="font-medium">{totalPrice.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Livraison</span>
                  <span className="font-medium text-slate-500">À l'étape suivante</span>
                </div>
              </div>

              <div className="flex justify-between text-base md:text-lg font-bold pt-4 border-t">
                <span>Total</span>
                <span className="text-blue-600">{totalPrice.toFixed(2)} €</span>
              </div>

              <div className="space-y-2 pt-2">
                <Link href="/paiement">
                  <Button size="lg" className="w-full h-10 md:h-11">
                    Procéder au paiement
                  </Button>
                </Link>

                <Link href="/catalogue">
                  <Button variant="outline" className="w-full h-10 md:h-11">
                    Continuer mes achats
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
