'use client';

import { useState } from 'react';
import { Hero, Header, FeaturedProducts, Benefits, HowItWorks, Testimonials, FAQ, Footer } from './components';
import { CartProvider } from './context/CartContext';
import { ContactForm } from '@/themes/shared/contact';
import { getFeaturedProducts } from './data/products';
import type { Product } from './data/products';

function SneakersCRContent() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const products = getFeaturedProducts();

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

      {/* Hero */}
      <Hero />

      {/* Featured Products */}
      <FeaturedProducts products={products} onWhatsAppClick={handleWhatsAppClick} />

      {/* Benefits */}
      <Benefits />

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

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

export default function SneakersCRPage() {
  return (
    <CartProvider>
      <SneakersCRContent />
    </CartProvider>
  );
}
