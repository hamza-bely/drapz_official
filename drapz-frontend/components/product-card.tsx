'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ProductCardProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
};

export function ProductCard({ id, name, description, price, imageUrl, stock }: ProductCardProps) {
  const { addItem } = useCart();

  const product = { id, name, description, price, imageUrl, stock };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/produit/${id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {stock <= 10 && stock > 0 && (
            <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">
              Stock limité
            </Badge>
          )}
          {stock === 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Épuisé
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/produit/${id}`}>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-slate-600 mb-2 line-clamp-2">{description}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">
          {price.toFixed(2)} €
        </span>
        <Button
          onClick={() => addItem({ id, name, description, price, imageUrl, stock }, 1)}
          disabled={stock === 0}
          className="gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Ajouter
        </Button>
      </CardFooter>
    </Card>
  );
}
