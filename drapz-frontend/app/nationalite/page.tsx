'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { apiClient } from '@/lib/api-client';

const CesiumComponent = dynamic(() => import('@/components/cesium-map'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-semibold">Chargement de la carte...</div>,
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
        const response = await apiClient.get<Country[]>('api/pays');
        setCountries(response.data);
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
      const response = await apiClient.get<Produit>(`api/produits/pays/${country.code}`);
      setPopup((prev) => ({
        ...prev,
        produit: response.data,
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
    <div className="w-full h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="p-6 bg-white border-b border-blue-200 shadow-sm z-10">
        <h1 className="text-4xl font-bold text-blue-900">Carte Interactive des Drapeaux</h1>
        <p className="text-blue-600 mt-2">Cliquez sur un drapeau pour voir les détails du pays et accéder au produit</p>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-semibold">
            Chargement des pays...
          </div>
        ) : (
          <CesiumComponent
            countries={countries}
            onCountryClick={handleCountryClick}
          />
        )}

        {popup.visible && popup.country && (
          <div className="absolute z-50 bg-white rounded-lg shadow-2xl border border-blue-200 p-6 max-w-md left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-96 overflow-y-auto">
            {/* Entête avec pays */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-800">
                  {popup.country.nom}
                </h3>
                <p className="text-sm text-blue-600 font-semibold">Code: {popup.country.code.toUpperCase()}</p>
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
                <p className="text-blue-600 font-semibold">Chargement du produit...</p>
              </div>
            ) : popup.produit ? (
              <div className="border-t pt-4">
                <h4 className="font-bold text-lg text-gray-800 mb-2">
                  {popup.produit.nom}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {popup.produit.description}
                </p>
                
                {/* Prix et stock */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {popup.produit.prix.toFixed(2)} €
                  </span>
                  <span className={`text-sm font-semibold px-3 py-1 rounded ${
                    popup.produit.stock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {popup.produit.stock > 0 ? `${popup.produit.stock} en stock` : 'Rupture'}
                  </span>
                </div>

                {/* Bouton Voir le produit */}
                <Link href={`/produit/${popup.produit.id}`} className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2">
                    Voir le produit
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="border-t pt-4 text-center text-gray-500">
                <p className="text-sm">Aucun produit disponible pour ce pays</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
