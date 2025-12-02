'use client';

import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
  productKind?: 'physical' | 'digital';
}

interface CartComponentProps {
  items?: CartItem[];
  onCheckout?: (items: CartItem[], total: number) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  taxRate?: number;
  shippingCost?: number;
  couponDiscount?: number;
  emptyMessage?: string;
  checkoutButtonText?: string;
  continueshoppingUrl?: string;
}

export function CartComponent({
  items = [],
  onCheckout,
  onUpdateQuantity,
  onRemoveItem,
  taxRate = 0.08,
  shippingCost = 0,
  couponDiscount = 0,
  emptyMessage = 'Tu carrito está vacío',
  checkoutButtonText = 'Proceder al Checkout',
  continueshoppingUrl = '/shop',
}: CartComponentProps) {
  const [localItems, setLocalItems] = useState<CartItem[]>(items);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Detectar si TODOS los items son digitales
  const allDigital = localItems.every(item => item.productKind === 'digital');
  
  // Mostrar envío solo si hay AL MENOS UN item físico
  const showShipping = !allDigital;
  const finalShippingCost = showShipping ? shippingCost : 0;

  // Calcular totales
  const subtotal = localItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = (subtotal - couponDiscount) * taxRate;
  const total = subtotal - couponDiscount + tax + finalShippingCost;

  // Handlers
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = localItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setLocalItems(updatedItems);
    
    if (onUpdateQuantity) {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = localItems.filter(item => item.id !== itemId);
    setLocalItems(updatedItems);
    
    if (onRemoveItem) {
      onRemoveItem(itemId);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      if (onCheckout) {
        await onCheckout(localItems, total);
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      setLocalItems([]);
    }
  };

  if (localItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 sm:p-12 text-center">
          <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{emptyMessage}</h2>
          <p className="text-gray-600 mb-8">Agrega algunos productos para comenzar</p>
          <Link href={continueshoppingUrl}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Continuar Comprando
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Tu Carrito</h1>
            <p className="text-gray-600 mt-2">
              {localItems.length} {localItems.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 font-medium text-sm sm:text-base flex items-center gap-2"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Vaciar carrito</span>
          </button>
        </div>

        {/* Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {localItems.map((item) => (
              <Card
                key={item.id}
                className="p-4 sm:p-6 border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex gap-4">
                  {/* Product Image Placeholder */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-gray-100"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ShoppingCart size={32} className="text-gray-400" />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    {item.sku && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">SKU: {item.sku}</p>
                    )}

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 sm:p-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          handleUpdateQuantity(item.id, val);
                        }}
                        className="w-12 sm:w-14 text-center border border-gray-300 rounded py-1 text-sm"
                        min="1"
                      />
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 sm:p-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700 transition p-1"
                      aria-label="Remove item"
                    >
                      <X size={20} />
                    </button>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-gray-600">
                        ${item.price.toFixed(2)} c/u
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Resumen</h2>

              {/* Pricing Breakdown */}
              <div className="space-y-3 pb-4 border-b border-gray-300">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm sm:text-base text-green-600 font-medium">
                    <span>Descuento:</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-700">Impuestos ({(taxRate * 100).toFixed(0)}%):</span>
                  <span className="font-semibold text-gray-900">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                {showShipping && (
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-700">Envío:</span>
                    <span className="font-semibold text-gray-900">
                      {finalShippingCost === 0 ? 'Gratis' : `$${finalShippingCost.toFixed(2)}`}
                    </span>
                  </div>
                )}

                {!showShipping && allDigital && (
                  <div className="flex justify-between text-sm sm:text-base text-blue-600">
                    <span>Entrega:</span>
                    <span className="font-semibold">Instantánea</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mt-4 mb-6">
                <span className="text-lg sm:text-xl font-bold text-gray-900">Total:</span>
                <span className="text-2xl sm:text-3xl font-bold text-green-600">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut || localItems.length === 0}
                className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg disabled:opacity-50 text-white font-semibold text-base"
              >
                {isCheckingOut ? 'Procesando...' : checkoutButtonText}
              </Button>

              {/* Continue Shopping */}
              <Link href={continueshoppingUrl}>
                <Button
                  variant="outline"
                  className="w-full h-11 sm:h-12 mt-3 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
                >
                  Continuar Comprando
                </Button>
              </Link>

              {/* Info */}
              <p className="text-xs text-gray-600 mt-4 text-center">
                Tienes acceso a todas las opciones de pago al proceder
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
