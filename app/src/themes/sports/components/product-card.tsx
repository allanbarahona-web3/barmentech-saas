'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Gift } from 'lucide-react';
import type { Product } from '../data/products';
import { ShippingModal } from './ShippingModal';
import type { ShippingFormValues } from './ShippingModal';

interface ProductCardProps {
  product: Product;
}

// US to EU size conversion mapping (accurate shoe sizing)
const SIZE_MAPPING = [
  { us: '6.5', eu: '39' },
  { us: '7', eu: '40' },
  { us: '7.5', eu: '40.5' },
  { us: '8', eu: '41' },
  { us: '8.5', eu: '42' },
  { us: '9', eu: '43' },
  { us: '9.5', eu: '43.5' },
  { us: '10', eu: '44' },
  { us: '10.5', eu: '44.5' },
  { us: '11', eu: '45' },
  { us: '11.5', eu: '46' },
  { us: '12', eu: '47' },
  { us: '12.5', eu: '47.5' },
  { us: '13', eu: '48' },
];

export function ProductCard({ product }: ProductCardProps) {
  const [showSizesModal, setShowSizesModal] = useState(false);
  const [showFreeShippingPopup, setShowFreeShippingPopup] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState<{ us: string; eu: string } | null>(null);
  const [currentLeadId, setCurrentLeadId] = useState<string>('');

  // Generate unique Lead ID
  const generateLeadId = (): string => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `SRC-${dateStr}-${random}`;
  };

  const handleSizeSelected = (size: { us: string; eu: string }) => {
    setSelectedSize(size);
    // Show free shipping popup after size selection
    setTimeout(() => {
      setShowSizesModal(false);
      setShowFreeShippingPopup(true);
    }, 200);
  };

  const handleFreeShippingYes = () => {
    setShowFreeShippingPopup(false);
    const leadId = generateLeadId();
    setCurrentLeadId(leadId);
    setShowShippingModal(true);
  };

  const handleFreeShippingNo = () => {
    setShowFreeShippingPopup(false);
    // Generate Lead ID even without shipping form
    const leadId = generateLeadId();
    setCurrentLeadId(leadId);
    
    // Save lead without shipping data
    const leadData = {
      leadId: leadId,
      timestamp: new Date().toISOString(),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      district: '',
      canton: '',
      province: '',
      product: product.name,
      sku: product.sku,
      talla: selectedSize ? `${selectedSize.us}US/${selectedSize.eu}EU` : 'N/A',
      price: product.price,
      status: 'Sin registro de envío gratis'
    };
    
    // Save to localStorage
    const existingLeads = JSON.parse(localStorage.getItem('sports_leads') || '[]');
    existingLeads.push(leadData);
    localStorage.setItem('sports_leads', JSON.stringify(existingLeads));
    
    // Open WhatsApp with Lead ID only
    if (selectedSize) {
      openWhatsApp(null, leadId);
    }
  };

  const handleShippingSubmit = (data: ShippingFormValues & { product: Product; selectedSize: { us: string; eu: string } }) => {
    setShowShippingModal(false);
    
    // Save lead to localStorage
    const leadData = {
      leadId: currentLeadId,
      timestamp: new Date().toISOString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      district: data.district,
      canton: data.canton,
      province: data.province,
      product: data.product.name,
      sku: data.product.sku,
      talla: `${data.selectedSize.us}US/${data.selectedSize.eu}EU`,
      price: data.product.price,
      status: 'Envío gratis aceptado ✓'
    };
    
    // Save to localStorage
    const existingLeads = JSON.parse(localStorage.getItem('sports_leads') || '[]');
    existingLeads.push(leadData);
    localStorage.setItem('sports_leads', JSON.stringify(existingLeads));
    
    // Open WhatsApp with lead info
    openWhatsApp(data, currentLeadId);
  };

  const openWhatsApp = (shippingData: (ShippingFormValues & { product: Product; selectedSize: { us: string; eu: string } }) | null, leadId: string) => {
    if (!selectedSize) return;

    const productLine = `Producto: ${product.name}`;
    const skuLine = `SKU: ${product.sku || 'N/A'}`;
    const priceLine = `Precio: $${product.price.toFixed(2)}`;
    const sizeLine = `Talla: ${selectedSize.us}US/${selectedSize.eu}EU`;

    let message = `Hola 👋 te escribo de SneakersCR\n\n`;
    message += `Me interesa:\n`;
    message += `${productLine}\n`;
    message += `${skuLine}\n`;
    message += `${priceLine}\n`;
    message += `${sizeLine}\n`;

    if (leadId) {
      message += `\n📦 Lead ID: #${leadId}\n`;
    }

    if (shippingData) {
      message += `🚚 Envío gratis aceptado ✓\n`;
    } else {
      message += `ℹ️ Sin registro de envío gratis\n`;
    }

    message += `\n¿Confirmas disponibilidad?`;

    const waLink = `https://wa.me/50671508835?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
    
    setSelectedSize(null);
    setCurrentLeadId('');
  };

  return (
    <>
      <div
        className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 flex flex-col h-full"
        data-product-id={product.id}
        data-product-name={product.name}
        data-product-price={product.price}
      >
        {/* Featured Badge (Top Right) */}
        {product.featured && (
          <div className="absolute top-3 right-3 z-30 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Hot
          </div>
        )}

        {/* Image Container */}
        <div className="relative h-64 sm:h-72 md:h-80 bg-gray-50 overflow-hidden flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
          {/* Product Name */}
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            ${product.price.toFixed(2)}
          </div>

          {/* Free Shipping Badge - Animated (Below Price) */}
          <div className="mb-3 inline-flex items-center gap-1 bg-green-50 border-2 border-green-500 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold animate-pulse w-fit z-10 relative">
            🚚 Envío Gratis
          </div>

          {/* Bullets / Benefits */}
          <div className="mb-4 space-y-1 flex-grow">
            {product.bullets.map((bullet, idx) => (
              <div key={idx} className="text-xs sm:text-sm text-gray-600 flex items-start">
                <span className="mr-2 text-orange-500 flex-shrink-0">✓</span>
                <span>{bullet}</span>
              </div>
            ))}
          </div>

          {/* Button - Opens Size Modal */}
          <button
            onClick={() => setShowSizesModal(true)}
            className="mt-auto w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 text-sm"
            title="Seleccionar talla"
          >
            <span>Consulta tu Talla</span>
          </button>
        </div>
      </div>

      {/* Sizes Modal */}
      {showSizesModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">${product.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => setShowSizesModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Sizes Grid */}
            <div className="p-4 sm:p-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">Selecciona tu talla:</p>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {SIZE_MAPPING.map((size) => (
                  <button
                    key={size.us}
                    onClick={() => handleSizeSelected(size)}
                    className={`py-3 px-3 border-2 rounded-lg font-semibold transition-all duration-200 ${
                      selectedSize?.us === size.us
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    <div className="text-xs">{size.us}US</div>
                    <div className="text-xs">{size.eu}EU</div>
                  </button>
                ))}
              </div>

              {/* Selected Size Display */}
              {selectedSize && (
                <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg">
                  <p className="text-sm font-semibold text-green-700">
                    ✓ Talla seleccionada: {selectedSize.us}US / {selectedSize.eu}EU
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowSizesModal(false);
                    setSelectedSize(null);
                  }}
                  className="w-full py-2 px-4 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Free Shipping Popup */}
      {showFreeShippingPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="p-6 sm:p-8">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <Gift className="w-8 h-8 text-green-600" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
                ¿Envío Gratis?
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-center mb-6">
                Registra tus datos y recibe <span className="font-semibold text-green-600">envío gratis a todo Costa Rica</span>
              </p>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleFreeShippingYes}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                >
                  ✓ Sí, Quiero Envío Gratis
                </button>
                <button
                  onClick={handleFreeShippingNo}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                >
                  No, Sin Envío Gratis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Modal */}
      <ShippingModal
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        product={product}
        selectedSize={selectedSize || { us: '10', eu: '44' }}
        onSubmit={handleShippingSubmit}
      />
    </>
  );
}

export default ProductCard;
