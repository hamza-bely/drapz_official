'use client';

import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { countryService, productService } from '@/lib/services';
import { useDebounce } from '@/hooks/use-debounce';
import { ProduitResponse, PaysResponse } from '@/types/api';

// Define a mapping of country codes to continents
const CONTINENTS_MAP: { [key: string]: string } = {
  // Asia
  AF: 'Asie', AL: 'Europe', DZ: 'Afrique', AS: 'Océanie', AD: 'Europe', AO: 'Afrique', AI: 'Amérique du Nord', AQ: 'Antarctique', AG: 'Amérique du Nord', AR: 'Amérique du Sud', AM: 'Asie', AW: 'Amérique du Nord', AU: 'Océanie', AT: 'Europe', AZ: 'Asie', BS: 'Amérique du Nord', BH: 'Asie', BD: 'Asie', BB: 'Amérique du Nord', BY: 'Europe', BE: 'Europe', BZ: 'Amérique du Nord', BJ: 'Afrique', BM: 'Amérique du Nord', BT: 'Asie', BO: 'Amérique du Sud', BA: 'Europe', BW: 'Afrique', BR: 'Amérique du Sud', IO: 'Asie', VG: 'Amérique du Nord', BN: 'Asie', BG: 'Europe', BF: 'Afrique', BI: 'Afrique', CV: 'Afrique', KH: 'Asie', CM: 'Afrique', CA: 'Amérique du Nord', KY: 'Amérique du Nord', CF: 'Afrique', TD: 'Afrique', CL: 'Amérique du Sud', CN: 'Asie', CX: 'Asie', CO: 'Amérique du Sud', KM: 'Afrique', CG: 'Afrique', CD: 'Afrique', CK: 'Océanie', CR: 'Amérique du Nord', HR: 'Europe', CU: 'Amérique du Nord', CW: 'Amérique du Nord', CY: 'Asie', CZ: 'Europe', CI: 'Afrique', DK: 'Europe', DJ: 'Afrique', DM: 'Amérique du Nord', DO: 'Amérique du Nord', EC: 'Amérique du Sud', EG: 'Afrique', SV: 'Amérique du Nord', GQ: 'Afrique', ER: 'Afrique', EE: 'Europe', ET: 'Afrique', FK: 'Amérique du Sud', FO: 'Europe', FJ: 'Océanie', FI: 'Europe', FR: 'Europe', GF: 'Amérique du Sud', PF: 'Océanie', GA: 'Afrique', GM: 'Afrique', GE: 'Asie', DE: 'Europe', GH: 'Afrique', GI: 'Europe', GR: 'Europe', GL: 'Amérique du Nord', GD: 'Amérique du Nord', GP: 'Amérique du Nord', GU: 'Océanie', GT: 'Amérique du Nord', GG: 'Europe', GN: 'Afrique', GW: 'Afrique', GY: 'Amérique du Sud', HT: 'Amérique du Nord', VA: 'Europe', HN: 'Amérique du Nord', HK: 'Asie', HU: 'Europe', IS: 'Europe', IN: 'Asie', ID: 'Asie', IR: 'Asie', IQ: 'Asie', IE: 'Europe', IM: 'Europe', IL: 'Asie', IT: 'Europe', JM: 'Amérique du Nord', JP: 'Asie', JE: 'Europe', JO: 'Asie', KZ: 'Asie', KE: 'Afrique', KI: 'Océanie', KP: 'Asie', KR: 'Asie', KW: 'Asie', KG: 'Asie', LA: 'Asie', LV: 'Europe', LB: 'Asie', LS: 'Afrique', LR: 'Afrique', LY: 'Afrique', LI: 'Europe', LT: 'Europe', LU: 'Europe', MO: 'Asie', MK: 'Europe', MG: 'Afrique', MW: 'Afrique', MY: 'Asie', MV: 'Asie', ML: 'Afrique', MT: 'Europe', MQ: 'Amérique du Nord', MR: 'Afrique', MU: 'Afrique', MX: 'Amérique du Nord', MD: 'Europe', MC: 'Europe', MN: 'Asie', ME: 'Europe', MS: 'Amérique du Nord', MA: 'Afrique', MZ: 'Afrique', MM: 'Asie', NA: 'Afrique', NR: 'Océanie', NP: 'Asie', NL: 'Europe', NC: 'Océanie', NZ: 'Océanie', NI: 'Amérique du Nord', NE: 'Afrique', NG: 'Afrique', NU: 'Océanie', NF: 'Océanie', NO: 'Europe', OM: 'Asie', PK: 'Asie', PS: 'Asie', PA: 'Amérique du Nord', PG: 'Océanie', PY: 'Amérique du Sud', PE: 'Amérique du Sud', PH: 'Asie', PN: 'Océanie', PL: 'Europe', PT: 'Europe', PR: 'Amérique du Nord', QA: 'Asie', RO: 'Europe', RU: 'Europe', RW: 'Afrique', RE: 'Afrique', KN: 'Amérique du Nord', LC: 'Amérique du Nord', VC: 'Amérique du Nord', WS: 'Océanie', SM: 'Europe', ST: 'Afrique', SA: 'Asie', SN: 'Afrique', RS: 'Europe', SC: 'Afrique', SL: 'Afrique', SG: 'Asie', SX: 'Amérique du Nord', SK: 'Europe', SI: 'Europe', SB: 'Océanie', SO: 'Afrique', ZA: 'Afrique', GS: 'Antarctique', ES: 'Europe', LK: 'Asie', SD: 'Afrique', SR: 'Amérique du Sud', SJ: 'Europe', SZ: 'Afrique', SE: 'Europe', CH: 'Europe', SY: 'Asie', TW: 'Asie', TJ: 'Asie', TZ: 'Afrique', TH: 'Asie', TL: 'Asie', TG: 'Afrique', TK: 'Océanie', TO: 'Océanie', TT: 'Amérique du Nord', TN: 'Afrique', TR: 'Asie', TM: 'Asie', TC: 'Amérique du Nord', TV: 'Océanie', UG: 'Afrique', UA: 'Europe', AE: 'Asie', GB: 'Europe', US: 'Amérique du Nord', UY: 'Amérique du Sud', UZ: 'Asie', VU: 'Océanie', VE: 'Amérique du Sud', VN: 'Asie', WF: 'Océanie', EH: 'Afrique', YE: 'Asie', ZM: 'Afrique', ZW: 'Afrique',
};


function CatalogueContent() {
  const [allProducts, setAllProducts] = useState<ProduitResponse[]>([]);
  const [products, setProducts] = useState<ProduitResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('nom');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const availableContinents = useMemo(() => {
    const continents = new Set<string>();
    allProducts.forEach((product) => {
      if (product.pays && product.pays.code && CONTINENTS_MAP[product.pays.code]) {
        continents.add(CONTINENTS_MAP[product.pays.code]);
      }
    });
    return Array.from(continents).sort();
  }, [allProducts]);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const [productResponse] = await Promise.all([
          productService.getProducts(0, 1000),
        ]);

        if (cancelled) return;

        setAllProducts(productResponse.content || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let filteredProducts = allProducts;

    // Filter by search term
    if (debouncedSearchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.nom.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Filter by continent
    if (selectedContinent !== 'all') {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.pays &&
          product.pays.code &&
          CONTINENTS_MAP[product.pays.code] === selectedContinent
      );
    }

    // Sort products
    let sortedProducts = [...filteredProducts];
    if (sortBy === 'prix_asc') {
      sortedProducts.sort((a, b) => a.prix - b.prix);
    } else if (sortBy === 'prix_desc') {
      sortedProducts.sort((a, b) => b.prix - a.prix);
    } else {
      sortedProducts.sort((a, b) => a.nom.localeCompare(b.nom));
    }

    setProducts(sortedProducts);
  }, [debouncedSearchTerm, selectedContinent, sortBy, allProducts]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">
          Notre Collection de Drapeaux
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Découvrez notre sélection de drapeaux de qualité
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Rechercher un drapeau</label>
          <Input
            placeholder="Ex: France, Brésil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <label className="text-sm font-medium mb-2 block">Filtrer par continent</label>
          <Select value={selectedContinent} onValueChange={setSelectedContinent}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tous les continents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les continents</SelectItem>
              {availableContinents.map((continent) => (
                <SelectItem key={continent} value={continent}>
                  {continent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-64">
          <label className="text-sm font-medium mb-2 block">Trier par</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nom">Nom (A-Z)</SelectItem>
              <SelectItem value="prix_asc">Prix croissant</SelectItem>
              <SelectItem value="prix_desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-80 md:h-96 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-slate-600 mb-4">Aucun produit trouvé pour votre sélection.</p>
          <Button onClick={() => {
            setSearchTerm('');
            setSelectedContinent('all');
          }}>
            Voir tous les produits
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.nom}
              description={product.description}
              price={product.prix}
              imageUrl={product.imageUrl}
              stock={product.stock}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CataloguePage() {
  return <CatalogueContent />;
}
