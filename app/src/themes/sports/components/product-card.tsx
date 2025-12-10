'use client';

import Image from 'next/image';
import { MessageCircle, HelpCircle } from 'lucide-react';
import type { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  onWhatsAppClick: (product: Product) => void;
}

export function ProductCard({ product, onWhatsAppClick }: ProductCardProps) {
  const handleConsultSize = () => {
    // Pre-fill message for size consultation
    const waLink = `https://wa.me/50687654321?text=Hola,%20estoy%20interesado%20en%20${encodeURIComponent(product.name)}%20-%20¿Qué%20tallas%20tienes%20disponibles?`;
    window.open(waLink, '_blank');
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200"
      data-product-id={product.id}
      data-product-name={product.name}
      data-product-price={product.price}
    >
      {/* Image Container */}
      <div className="relative h-64 sm:h-72 md:h-80 bg-gray-50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Badge si es featured */}
        {product.featured && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Hot
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 md:p-6 flex flex-col h-full">
        {/* Product Name */}
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          ${product.price.toFixed(2)}
        </div>

        {/* Bullets / Benefits */}
        <div className="mb-5 flex-1">
          {product.bullets.map((bullet, idx) => (
            <div key={idx} className="text-xs sm:text-sm text-gray-600 mb-1.5 flex items-start">
              <span className="mr-2 mt-1 text-orange-500">✓</span>
              <span>{bullet}</span>
            </div>
          ))}
        </div>

        {/* Buttons Container */}
        <div className="flex gap-2 sm:gap-3">
          {/* Consult Size Button */}
          <button
            onClick={handleConsultSize}
            className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-2 sm:py-2.5 rounded-lg transition-all duration-200 text-xs sm:text-sm"
            title={`Consultar tallas disponibles`}
          >
            <HelpCircle size={16} />
            <span>Consultar talla</span>
          </button>

          {/* Lead/Info Button */}
          <button
            onClick={() => onWhatsAppClick(product)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white border-2 border-orange-500 text-orange-600 font-semibold py-2 sm:py-2.5 rounded-lg hover:bg-orange-50 active:bg-orange-100 transition-all duration-200 text-xs sm:text-sm"
            title={`Pedir info por WhatsApp`}
          >
            <MessageCircle size={16} />
            <span>Más info</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
