'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';

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
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const product = { id, name, description, price, imageUrl, stock };

  const handleAdd = () => {
    if (!user) {
      toast({
        title: 'Connectez-vous',
        description: "Connectez-vous pour ajouter un produit au panier",
      });
      router.push('/auth/login');
      return;
    }
    addItem(product, 1);
    toast({
      title: 'Succès',
      description: `${name} ajouté au panier`,
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Product Image Section */}
      <Link href={`/produit/${id}`} className="flex-shrink-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
          />

          {/* Stock Badge */}
          {stock <= 10 && stock > 0 && (
            <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600 text-white text-xs">
              Stock limité
            </Badge>
          )}
          {stock === 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white text-xs">
              Épuisé
            </Badge>
          )}
        </div>
      </Link>

      {/* Product Content */}
      <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
        <Link href={`/produit/${id}`}>
          <h3 className="font-semibold text-sm md:text-base mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>
        <p className="text-xs md:text-sm text-slate-600 line-clamp-2 flex-1">
          {description}
        </p>
      </CardContent>

      {/* Product Footer */}
      <CardFooter className="p-3 md:p-4 pt-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 md:gap-3">
        <span className="text-xl md:text-2xl font-bold text-blue-600 order-2 sm:order-1">
          {price.toFixed(2)} €
        </span>
        <Button
          onClick={handleAdd}
          disabled={stock === 0}
          className="gap-2 order-1 sm:order-2 w-full sm:w-auto text-xs md:text-sm h-9 md:h-10"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Ajouter</span>
          <span className="sm:hidden">+</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
