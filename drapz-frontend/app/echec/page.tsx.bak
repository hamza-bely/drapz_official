'use client';

import Link from 'next/link';
import { XCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ErrorPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <XCircle className="h-20 w-20 mx-auto text-red-500" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Paiement échoué</h1>
        <p className="text-lg text-slate-600 mb-8">
          Votre paiement n'a pas pu être traité. Aucun montant n'a été débité.
        </p>

        <Card className="mb-8">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4 text-left">
              <RefreshCcw className="h-10 w-10 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Que faire maintenant ?</h3>
                <p className="text-sm text-slate-600">
                  Vérifiez vos informations de paiement et réessayez.
                  Si le problème persiste, contactez notre service client.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/panier">
            <Button size="lg" className="w-full sm:w-auto">
              Retour au panier
            </Button>
          </Link>
          <Link href="/catalogue">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Continuer mes achats
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
