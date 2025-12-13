'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Country {
  id: string;
  nom: string;
  code: string;
  latitude: number;
  longitude: number;
  flagUrl: string;
}

interface CesiumMapProps {
  countries: Country[];
  onCountryClick: (country: Country) => void;
}

const CesiumMap: React.FC<CesiumMapProps> = ({ countries, onCountryClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 3,     // Disable keyboard navigation                                                                                                                                                                       │
  });

    mapRef.current = map;

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Configurer les icônes par défaut de Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    // Créer les marqueurs pour chaque pays
    countries.forEach((country) => {
      // Créer une icône avec le drapeau
      const customIcon = L.divIcon({
        className: 'custom-country-icon',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <img 
              src="${country.flagUrl}" 
              alt="${country.nom}"
              style="
                width: 50px;
                height: 35px;
                border-radius: 4px;
                border: 3px solid white;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                transition: transform 0.2s;
              "
              onmouseover="this.style.transform='scale(1.1)'"
              onmouseout="this.style.transform='scale(1)'"
            />
          </div>
        `,
        iconSize: [56, 43],
        iconAnchor: [28, 43],
        popupAnchor: [0, -43],
      });

      const marker = L.marker([country.latitude, country.longitude], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<strong>${country.nom}</strong>`);

      marker.on('click', () => {
        onCountryClick(country);
        map.flyTo([country.latitude, country.longitude], 6, { duration: 1 });
      });
    });

    // Redimensionner la carte pour s'assurer qu'elle s'affiche correctement
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
    };
  }, [countries, onCountryClick]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '750px',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
      className="relative z-0"
    />
  );
};

export default CesiumMap;
