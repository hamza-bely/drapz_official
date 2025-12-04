'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COUNTRIES_DATA = [
  { id: 'fr', name: 'France', lat: 46.227638, lng: 2.213749, code: 'fr' },
  { id: 'de', name: 'Allemagne', lat: 51.165691, lng: 10.451526, code: 'de' },
  { id: 'it', name: 'Italie', lat: 41.871940, lng: 12.56738, code: 'it' },
  { id: 'es', name: 'Espagne', lat: 40.463667, lng: -3.74922, code: 'es' },
  { id: 'pt', name: 'Portugal', lat: 39.399872, lng: -8.224454, code: 'pt' },
  { id: 'gb', name: 'Royaume-Uni', lat: 55.378051, lng: -3.435973, code: 'gb' },
  { id: 'nl', name: 'Pays-Bas', lat: 52.132633, lng: 5.291266, code: 'nl' },
  { id: 'be', name: 'Belgique', lat: 50.503887, lng: 4.469936, code: 'be' },
  { id: 'ch', name: 'Suisse', lat: 46.818188, lng: 8.227512, code: 'ch' },
  { id: 'at', name: 'Autriche', lat: 47.516231, lng: 14.550072, code: 'at' },
  { id: 'us', name: 'États-Unis', lat: 37.09024, lng: -95.712891, code: 'us' },
  { id: 'ca', name: 'Canada', lat: 56.130366, lng: -106.346771, code: 'ca' },
  { id: 'mx', name: 'Mexique', lat: 23.634501, lng: -102.552784, code: 'mx' },
  { id: 'br', name: 'Brésil', lat: -14.235004, lng: -51.92528, code: 'br' },
  { id: 'ar', name: 'Argentine', lat: -38.416097, lng: -63.616672, code: 'ar' },
  { id: 'jp', name: 'Japon', lat: 36.204824, lng: 138.252924, code: 'jp' },
  { id: 'cn', name: 'Chine', lat: 35.86166, lng: 104.195397, code: 'cn' },
  { id: 'in', name: 'Inde', lat: 20.5937, lng: 78.96288, code: 'in' },
  { id: 'kr', name: 'Corée du Sud', lat: 35.907757, lng: 127.766922, code: 'kr' },
  { id: 'au', name: 'Australie', lat: -25.2744, lng: 133.7751, code: 'au' },
  { id: 'nz', name: 'Nouvelle-Zélande', lat: -40.900557, lng: 174.885971, code: 'nz' },
  { id: 'za', name: 'Afrique du Sud', lat: -30.559482, lng: 22.937453, code: 'za' },
  { id: 'eg', name: 'Égypte', lat: 26.820553, lng: 30.802498, code: 'eg' },
  { id: 'ng', name: 'Nigéria', lat: 9.081999, lng: 8.675277, code: 'ng' },
  { id: 'ru', name: 'Russie', lat: 61.52401, lng: 105.318756, code: 'ru' },
  { id: 'th', name: 'Thaïlande', lat: 15.870032, lng: 100.992541, code: 'th' },
];

interface PopupData {
  country: (typeof COUNTRIES_DATA)[0];
  visible: boolean;
  x: number;
  y: number;
}

export default function CountriesMapPage() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [popup, setPopup] = React.useState<PopupData>({
    country: COUNTRIES_DATA[0],
    visible: false,
    x: 0,
    y: 0,
  });

  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const latLngToCanvas = useCallback(
    (lat: number, lng: number) => {
      const x = ((lng + 180) / 360) * dimensions.width;
      const y = ((90 - lat) / 180) * dimensions.height;
      return { x, y };
    },
    [dimensions]
  );

  React.useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#e0e7ff';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 36; i++) {
      ctx.beginPath();
      ctx.moveTo((canvas.width / 36) * i, 0);
      ctx.lineTo((canvas.width / 36) * i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= 18; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (canvas.height / 18) * i);
      ctx.lineTo(canvas.width, (canvas.height / 18) * i);
      ctx.stroke();
    }

    COUNTRIES_DATA.forEach((country) => {
      const { x, y } = latLngToCanvas(country.lat, country.lng);

      ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.stroke();
    });
  }, [dimensions, latLngToCanvas]);

  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let closestCountry = COUNTRIES_DATA[0];
      let closestDistance = Infinity;

      COUNTRIES_DATA.forEach((country) => {
        const { x, y } = latLngToCanvas(country.lat, country.lng);
        const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);

        if (distance < closestDistance && distance < 20) {
          closestDistance = distance;
          closestCountry = country;
        }
      });

      if (closestDistance < 20) {
        setPopup({
          country: closestCountry,
          visible: true,
          x: clickX,
          y: clickY,
        });
      }
    },
    [latLngToCanvas]
  );

  const handleClosePopup = useCallback(() => {
    setPopup((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="p-6 bg-white border-b border-blue-200 shadow-sm">
        <h1 className="text-4xl font-bold text-blue-900">Carte Interactive des Drapeaux</h1>
        <p className="text-blue-600 mt-2">Cliquez sur un pays pour voir son drapeau et accéder au produit</p>
      </div>

      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-crosshair"
      >
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onClick={handleCanvasClick}
          className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 hover:opacity-95 transition-opacity"
        />

        {popup.visible && (
          <div
            className="absolute z-50 bg-white rounded-lg shadow-2xl border border-blue-200 p-4 min-w-max"
            style={{
              left: `${Math.min(
                popup.x + 10,
                dimensions.width - 320
              )}px`,
              top: `${Math.max(popup.y - 280, 10)}px`,
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-gray-800">
                {popup.country.name}
              </h3>
              <button
                onClick={handleClosePopup}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 relative w-64 h-40 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={`https://flagcdn.com/w320/${popup.country.code}.png`}
                alt={`Drapeau de ${popup.country.name}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-2">
              <Link href={`/produit/${popup.country.name.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Voir le produit
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
