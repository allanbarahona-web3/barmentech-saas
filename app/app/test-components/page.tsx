'use client';

import { useState } from 'react';
import { LoginModal } from '@/src/themes/shared/auth';
import { SignupModal } from '@/src/themes/shared/auth';
import { ContactForm } from '@/src/themes/shared/contact';
import { CheckoutModal, PaymentModal, CartComponent } from '@/src/themes/shared/commerce';
import type { CheckoutData } from '@/src/themes/shared/commerce';

const mockCartItems = [
  { id: '1', name: 'Wireless Headphones', price: 79.99, quantity: 1, image: '/product1.jpg', productKind: 'physical' as const },
  { id: '2', name: 'USB-C Cable', price: 12.99, quantity: 2, image: '/product2.jpg', productKind: 'physical' as const },
  { id: '3', name: 'Phone Case', price: 24.99, quantity: 1, image: '/product3.jpg', productKind: 'physical' as const },
];

// Ejemplo: Opciones de envío para USA
const usaShippingOptions = [
  { id: 'free', name: 'Envío Gratis (7-10 días)', price: 0, days: '7-10' },
  { id: 'usps', name: 'USPS Standard (5-7 días)', price: 8.99, days: '5-7' },
  { id: 'ups', name: 'UPS Express (2-3 días)', price: 18.99, days: '2-3' },
];

// Ejemplo: Opciones de envío para Costa Rica
const crShippingOptions = [
  { id: 'free', name: 'Correos Gratis (5-7 días)', price: 0, days: '5-7' },
  { id: 'correos', name: 'Correos Express (2-3 días)', price: 6.99, days: '2-3' },
  { id: 'dhl', name: 'DHL Premium (1 día)', price: 25.00, days: '1' },
];

// Mock checkout data
const mockCheckoutData: CheckoutData = {
  firstName: 'Juan',
  lastName: 'García',
  email: 'juan@example.com',
  phone: '+1234567890',
  address: '123 Main Street',
  city: 'Miami',
  state: 'FL',
  zipCode: '33101',
  country: 'United States',
  shippingMethod: 'ups',
  shippingCost: 18.99,
  couponDiscount: 0,
  subtotal: 202.96,
  tax: 16.24,
  total: 238.19,
  walletBalance: 50,
};

export default function ComponentsTestPage() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(mockCheckoutData);

  // Para demostrar: aquí podrías usar usaShippingOptions o crShippingOptions según el país del tenant
  console.log('Available shipping options for USA:', usaShippingOptions);
  console.log('Available shipping options for CR:', crShippingOptions);

  const buttons = [
    { id: 'login', label: 'LoginModal', color: 'bg-blue-600' },
    { id: 'signup', label: 'SignupModal', color: 'bg-green-600' },
    { id: 'contact', label: 'ContactForm', color: 'bg-purple-600' },
    { id: 'checkout', label: 'CheckoutModal', color: 'bg-orange-600' },
    { id: 'payment', label: 'PaymentModal', color: 'bg-red-600' },
    { id: 'cart', label: 'CartComponent', color: 'bg-indigo-600' },
  ];

  const handleCheckoutSubmit = (data: any) => {
    console.log('Checkout submitted:', data);
    // Aquí pasamos los datos del checkout al payment modal
    setCheckoutData(prev => ({
      ...prev,
      ...data,
    }));
    // Cerrar checkout y abrir payment
    setTimeout(() => {
      setOpenModal('payment');
    }, 300);
  };

  const handleCheckout = async (items: any[], total: number) => {
    console.log('Cart checkout:', { items, total });
    alert(`Carrito: ${items.length} productos por $${total.toFixed(2)}`);
    setOpenModal(null);
  };

  const handlePaymentSubmit = async (method: string, data: CheckoutData) => {
    console.log('Payment submitted with method:', method);
    console.log('Full checkout data:', data);
    alert(`Pago procesado con: ${method}\nTotal: $${data.total.toFixed(2)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Componentes Compartidos - Test
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Prueba la responsividad de todos los componentes. Usa DevTools (F12) para ver en móvil.
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {buttons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setOpenModal(btn.id)}
              className={`${btn.color} hover:shadow-lg text-white font-bold py-3 sm:py-4 rounded-lg transition transform hover:scale-105 text-sm sm:text-base`}
            >
              {btn.label}
            </button>
          ))}
          <a
            href="/test-components/tables-demo"
            className="bg-teal-600 hover:shadow-lg text-white font-bold py-3 sm:py-4 rounded-lg transition transform hover:scale-105 text-sm sm:text-base inline-block"
          >
            📊 Tablas Compartidas
          </a>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Instrucciones:</h2>
          <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
            <li>✅ Haz clic en cualquier botón para abrir el modal</li>
            <li>✅ Prueba llenar los formularios</li>
            <li>✅ Abre DevTools (F12) → Modo responsivo → Prueba en mobile (375px, 768px, 1024px)</li>
            <li>✅ Verifica que todo se vea bien en diferentes tamaños</li>
            <li>✅ Busca problemas de UI: texto cortado, botones fuera de lugar, overflow, etc.</li>
            <li>🎯 Prueba: Checkout → Payment (llena checkout y el payment se abre automáticamente)</li>
          </ul>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 sm:p-8">
          <h3 className="text-lg font-bold text-blue-900 mb-3">Componentes probados:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm text-blue-900">
            <div>
              <p className="font-semibold">✓ LoginModal</p>
              <p className="text-xs text-blue-800">Email, Contraseña, TenantID</p>
            </div>
            <div>
              <p className="font-semibold">✓ SignupModal</p>
              <p className="text-xs text-blue-800">Empresa, Email, Contraseña, Términos</p>
            </div>
            <div>
              <p className="font-semibold">✓ ContactForm</p>
              <p className="text-xs text-blue-800">Nombre, Email, Teléfono, Mensaje</p>
            </div>
            <div>
              <p className="font-semibold">✓ CheckoutModal</p>
              <p className="text-xs text-blue-800">Dirección, Resumen, Envío, Cupones</p>
            </div>
            <div>
              <p className="font-semibold">✓ PaymentModal</p>
              <p className="text-xs text-blue-800">5 métodos de pago, Billetera</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {openModal === 'login' && (
        <LoginModal
          redirectPath="/admin/dashboard"
          title="Prueba - Login"
        />
      )}

      {openModal === 'signup' && (
        <SignupModal
          title="Prueba - Signup"
        />
      )}

      <ContactForm
        isOpen={openModal === 'contact'}
        onClose={() => setOpenModal(null)}
        language="es"
      />

      <CheckoutModal
        isOpen={openModal === 'checkout'}
        onClose={() => setOpenModal(null)}
        cartItems={mockCartItems}
        shippingOptions={usaShippingOptions}
        onSubmit={handleCheckoutSubmit}
      />

      <PaymentModal
        isOpen={openModal === 'payment'}
        onClose={() => setOpenModal(null)}
        checkoutData={checkoutData}
        cartItems={mockCartItems}
        onPaymentSubmit={handlePaymentSubmit}
      />

      {openModal === 'cart' && (
        <CartComponent
          items={mockCartItems}
          onCheckout={handleCheckout}
          taxRate={0.08}
          shippingCost={9.99}
          couponDiscount={0}
        />
      )}
    </div>
  );
}
