'use client';

import { useState } from 'react';
import { ProductCard } from '../components/product-card';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { CartProvider } from '../context/CartContext';
import { ContactForm } from '@/themes/shared/contact';
import { getAllProducts } from '../data/products';
import Link from 'next/link';
import type { Product } from '../data/products';

function CatalogoContent() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const products = getAllProducts();

  const handleWhatsAppClick = (product: Product) => {
    setSelectedProduct(product);
    setIsContactOpen(true);
  };

  const handleContactSubmit = () => {
    if (selectedProduct) {
      const waLink = `https://wa.me/50687654321?text=Hola,%20vengo%20de%20sneakerscr.com%20y%20quiero%20más%20info%20sobre%3A%20${encodeURIComponent(selectedProduct.name)}`;
      window.open(waLink, '_blank');
    }
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
            Explora todos nuestros {products.length} tenis en liquidación
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onWhatsAppClick={handleWhatsAppClick} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Contact Modal */}
      <ContactForm
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        language="es"
        onSuccess={handleContactSubmit}
      />
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
