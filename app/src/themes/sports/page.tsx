'use client';

import { useState } from 'react';
import { Hero, Header, FeaturedProducts, Benefits, HowItWorks, Testimonials, FAQ, Footer, WhatsAppFloat } from './components';
import { CartProvider, useSportsCart } from './context/CartContext';
import { ContactForm } from '@/themes/shared/contact';
import { CheckoutModal } from '@/themes/shared/commerce';
import { getFeaturedProducts } from './data/products';

function SneakersCRContent() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { items } = useSportsCart();
  const products = getFeaturedProducts();

  const handleContactSubmit = () => {
    // ContactForm will handle WhatsApp link directly
  };

  return (
    <main className="bg-white">
      {/* Header with Cart */}
      <Header onCheckoutClick={() => setIsCheckoutOpen(true)} />

      {/* Hero */}
      <Hero />

      {/* Featured Products */}
      <FeaturedProducts products={products} />

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

      {/* Checkout Modal */}
      {items.length > 0 && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={items}
          onPaymentClick={() => {
            // Payment will be handled by PaymentModal in CheckoutModal
            console.log('Payment initiated from checkout');
          }}
        />
      )}

      {/* WhatsApp Float Button */}
      <WhatsAppFloat />
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
