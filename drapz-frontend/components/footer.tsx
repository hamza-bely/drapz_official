import Link from 'next/link';
import { Flag } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Drapz
              </span>
            </Link>
            <p className="text-sm text-slate-600">
              Votre destination pour des drapeaux de qualité supérieure. Livraison rapide dans toute la France.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalogue?category=drapeaux-nationaux" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Drapeaux Nationaux
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=drapeaux-historiques" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Drapeaux Historiques
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=drapeaux-thematiques" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Drapeaux Thématiques
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=drapeaux-personnalises" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Drapeaux Personnalisés
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Informations</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Retours
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} Drapz. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
