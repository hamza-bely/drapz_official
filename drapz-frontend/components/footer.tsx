import Link from 'next/link';
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-50 mt-12">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Branding Section */}
          <div className="space-y-4">

            <p className="text-sm text-slate-600 leading-relaxed">
              Votre destination pour des drapeaux de qualité supérieure. Livraison rapide dans toute la France.
            </p>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="font-semibold text-sm md:text-base mb-4">Catégories</h3>
            <ul className="space-y-2 text-xs md:text-sm">
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

          {/* Information Section */}
          <div>
            <h3 className="font-semibold text-sm md:text-base mb-4">Informations</h3>
            <ul className="space-y-2 text-xs md:text-sm">
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

          {/* Legal Section */}
          <div>
            <h3 className="font-semibold text-sm md:text-base mb-4">Légal</h3>
            <ul className="space-y-2 text-xs md:text-sm">
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

        {/* Copyright Section */}
        <div className="border-t pt-6 md:pt-8 text-center text-xs md:text-sm text-slate-600">
          <p>&copy; {currentYear} Drapz. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
