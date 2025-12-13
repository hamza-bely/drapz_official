'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking the button
    if (!user) {
      toast({
        title: 'Connectez-vous',
        description: "Connectez-vous pour ajouter un produit au panier",
        variant: 'destructive',
      });
      router.push('/auth/login');
      return;
    }
    addItem(product, 1);
    toast({
      title: 'Panier mis à jour!',
      description: `${name} a été ajouté au panier.`,
    });
  };

  return (
    <Card className="group overflow-hidden rounded-lg border-2 border-transparent hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col">
      <Link href={`/produit/${id}`} className="block w-full flex-shrink-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Overlay that appears on hover */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleAdd}
              disabled={stock === 0}
              size="lg"
              className="rounded-full bg-white/80 text-blue-600 hover:bg-white backdrop-blur-sm shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300"
              aria-label="Ajouter au panier"
            >
              <ShoppingCart className="h-6 w-6" />
            </Button>
          </div>

          {/* Stock Badge */}
          {stock <= 10 && stock > 0 && (
            <Badge className="absolute top-2 left-2 bg-orange-500/90 text-white text-xs border-none">
              Stock Faible
            </Badge>
          )}
          {stock === 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2 text-xs border-none">
              Épuisé
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg mb-1 line-clamp-2 transition-colors duration-300 group-hover:text-blue-600">
            {name}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2">
            {description}
          </p>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <p className="text-2xl font-extrabold text-slate-800">
            {price.toFixed(2)}
            <span className="text-base font-medium">€</span>
          </p>
          <span className="text-xs text-slate-500">{stock > 0 ? `${stock} en stock` : 'Indisponible'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
