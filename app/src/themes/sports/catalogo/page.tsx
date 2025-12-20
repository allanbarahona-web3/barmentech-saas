'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '../components/product-card';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { WhatsAppFloat } from '../components/whatsapp-float';
import { CartProvider } from '../context/CartContext';
import { getAllProducts, getUniqueBrands, getProductsByBrand } from '../data/products';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '../data/products';

function CatalogoContent() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Auto-select brand from URL param
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam) {
      setSelectedBrand(decodeURIComponent(brandParam));
    }
  }, [searchParams]);
  
  const allProducts = getAllProducts();
  const brands = getUniqueBrands();
  const displayedProducts = selectedBrand ? getProductsByBrand(selectedBrand) : allProducts;

  // Dummy function - ProductCard now handles WhatsApp directly
  const handleWhatsAppClick = (product: Product) => {
    console.log('Product clicked:', product.name);
  };

  return (
    <main className="bg-white">
      {/* Header with Cart */}
      <Header />

      {/* Catalog Header */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <Link href="/sports" className="text-orange-600 hover:text-orange-700 font-semibold text-sm mb-4 block">
            ← Volver a inicio
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Catálogo completo
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Explora todos nuestros {allProducts.length} tenis en liquidación
          </p>
        </div>
      </div>

      {/* Brand Filter */}
      <section className="sticky top-16 z-30 bg-white border-b border-gray-200 py-4 sm:py-6 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-700">Filtrar por marca:</span>
            
            {/* "Todas" Button */}
            <button
              onClick={() => setSelectedBrand(null)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedBrand === null
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({allProducts.length})
            </button>

            {/* Brand Buttons */}
            {brands.map((brand) => {
              const count = getProductsByBrand(brand).length;
              return (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                    selectedBrand === brand
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {brand} ({count})
                </button>
              );
            })}

            {/* Clear Filter Button (if selected) */}
            {selectedBrand && (
              <button
                onClick={() => setSelectedBrand(null)}
                className="ml-auto p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                title="Limpiar filtro"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {displayedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg mb-4">No hay productos en esta marca</p>
              <button
                onClick={() => setSelectedBrand(null)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-8 text-sm">
                Mostrando {displayedProducts.length} producto{displayedProducts.length !== 1 ? 's' : ''}{' '}
                {selectedBrand && `de ${selectedBrand}`}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Float Button */}
      <WhatsAppFloat />
    </main>
  );
}

export default function CatalogoPage() {
  return (
    <CartProvider>
      <CatalogoContent />
    </CartProvider>
  );
}
