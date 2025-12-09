'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Package } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <CheckCircle className="h-20 w-20 mx-auto text-green-500" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Commande confirmée !</h1>
        <p className="text-lg text-slate-600 mb-8">
          Merci pour votre achat. Votre commande a été enregistrée avec succès.
        </p>

        <Card className="mb-8">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4 text-left">
              <Package className="h-10 w-10 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Que se passe-t-il maintenant ?</h3>
                <p className="text-sm text-slate-600">
                  Vous allez recevoir un email de confirmation avec les détails de votre commande.
                  Votre colis sera expédié sous 24-48h.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalogue">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Continuer mes achats
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
