'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { countryService, productService } from '@/lib/services';

const CesiumComponent = dynamic(() => import('@/components/cesium-map'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-50 text-black font-semibold">Chargement de la carte...</div>,
});

interface Country {
  id: string;
  nom: string;
  code: string;
  latitude: number;
  longitude: number;
  flagUrl: string;
}

interface PaysInfo {
  id: string;
  nom: string;
  code: string;
  latitude: number;
  longitude: number;
  flagUrl: string;
}

interface Produit {
  id: string;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  imageUrl: string;
  pays: PaysInfo;
}

interface PopupData {
  country: Country | null;
  produit: Produit | null;
  loadingProduit: boolean;
  visible: boolean;
}

export default function CountriesMapPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState<PopupData>({
    country: null,
    produit: null,
    loadingProduit: false,
    visible: false,
  });

  // Récupérer les pays depuis le backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await countryService.getAllCountries();
        setCountries(response);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des pays:', error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryClick = async (country: Country) => {
    setPopup({
      country,
      produit: null,
      loadingProduit: true,
      visible: true,
    });

    // Charger le produit associé au pays
    try {
      const response = await productService.getProductByCountryCode(country.code);

      // Le backend peut renvoyer un produit seul ou un tableau de produits.
      let produitData = null as Produit | null;
      if (Array.isArray(response)) {
        produitData = response.length > 0 ? response[0] : null;
      } else if (response && typeof response === 'object') {
        produitData = response as Produit;
      }

      setPopup((prev) => ({
        ...prev,
        produit: produitData,
        loadingProduit: false,
      }));
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      setPopup((prev) => ({
        ...prev,
        loadingProduit: false,
      }));
    }
  };

  const handleClosePopup = () => {
    setPopup((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="w-full flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="p-6 bg-white border-b border-gray-200 shadow-sm z-10">
        <h1 className="text-4xl font-bold text-black">Carte Interactive des Drapeaux</h1>
        <p className="text-black mt-2">Cliquez sur un drapeau pour voir les détails du pays et accéder au produit</p>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-black font-semibold">
            Chargement des pays...
          </div>
        ) : (
          <CesiumComponent
            countries={countries}
            onCountryClick={handleCountryClick}
          />
        )}

        {popup.visible && popup.country && (
          <div className="absolute z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 max-w-md left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-96 overflow-y-auto">
            {/* Entête avec pays */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-black">
                  {popup.country.nom}
                </h3>
                <p className="text-sm text-black font-semibold">Code: {popup.country.code.toUpperCase()}</p>
              </div>
              <button
                onClick={handleClosePopup}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Drapeau */}
            <div className="mb-4 relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={popup.country.flagUrl}
                alt={`Drapeau de ${popup.country.nom}`}
                fill
                className="object-cover"
              />
            </div>

            {/* Info produit */}
            {popup.loadingProduit ? (
              <div className="border-t pt-4 text-center">
                <p className="text-black font-semibold">Chargement du produit...</p>
              </div>
            ) : popup.produit ? (
              <div className="border-t pt-4">
                <h4 className="font-bold text-lg text-black mb-2">
                  {popup.produit.nom}
                </h4>
                <p className="text-sm text-black mb-3">
                  {popup.produit.description}
                </p>

                {/* Prix et stock */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-black">
                    {popup.produit.prix.toFixed(2)} €
                  </span>
                  <span className={`text-sm font-semibold px-3 py-1 rounded ${popup.produit.stock > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {popup.produit.stock > 0 ? `${popup.produit.stock} en stock` : 'Rupture'}
                  </span>
                </div>

                {/* Bouton Voir le produit */}
                <Link href={`/produit/${popup.produit.id}`} className="w-full">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2">
                    Voir le produit
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="border-t pt-4 text-center text-black">
                <p className="text-sm">Aucun produit disponible pour ce pays</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
