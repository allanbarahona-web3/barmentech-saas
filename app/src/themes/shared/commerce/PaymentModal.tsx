'use client';

import { useState } from 'react';
import { X, CreditCard, Wallet, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
  productKind?: 'physical' | 'digital';
}

export interface PaymentMethod {
  id: 'stripe' | 'paypal' | 'mercadopago' | 'crypto' | 'manual';
  name: string;
  description: string;
  icon: 'card' | 'paypal' | 'mercado' | 'crypto' | 'bank';
  enabled?: boolean;
}

export interface CheckoutData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  shippingMethod: string;
  shippingCost: number;
  couponDiscount: number;
  useGiftCard?: boolean;
  useWallet?: boolean;
  walletBalance?: number;
  subtotal: number;
  tax: number;
  total: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutData: CheckoutData;
  cartItems: CartItem[];
  paymentMethods?: PaymentMethod[];
  onPaymentSubmit?: (method: string, data: CheckoutData) => Promise<void>;
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'stripe',
    name: 'Tarjeta de Crédito/Débito',
    description: 'Visa, Mastercard, American Express',
    icon: 'card',
    enabled: true,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pago seguro con tu cuenta PayPal',
    icon: 'paypal',
    enabled: true,
  },
  {
    id: 'mercadopago',
    name: 'MercadoPago',
    description: 'Paga con tu billetera MercadoPago',
    icon: 'mercado',
    enabled: true,
  },
  {
    id: 'crypto',
    name: 'Criptomonedas',
    description: 'Bitcoin, Ethereum, USDC',
    icon: 'crypto',
    enabled: true,
  },
  {
    id: 'manual',
    name: 'Transferencia Bancaria',
    description: 'Transferencia directa a nuestra cuenta',
    icon: 'bank',
    enabled: true,
  },
];

export function PaymentModal({
  isOpen,
  onClose,
  checkoutData,
  cartItems,
  paymentMethods = DEFAULT_PAYMENT_METHODS,
  onPaymentSubmit,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('stripe');
  const [isLoading, setIsLoading] = useState(false);
  const [useGiftCard, setUseGiftCard] = useState(checkoutData.useGiftCard || false);
  const [useWallet, setUseWallet] = useState(checkoutData.useWallet || false);
  const [walletAmount] = useState(Math.min(
    checkoutData.walletBalance || 0,
    checkoutData.total
  ));

  // Calcular total con opciones alternativas
  const walletDiscount = useWallet ? walletAmount : 0;
  const finalTotal = Math.max(checkoutData.total - walletDiscount, 0);

  const handlePaymentSubmit = async () => {
    setIsLoading(true);
    try {
      if (onPaymentSubmit) {
        const updatedData = {
          ...checkoutData,
          useGiftCard,
          useWallet,
          walletBalance: useWallet ? walletAmount : undefined,
        };
        await onPaymentSubmit(selectedMethod, updatedData);
      }
      onClose();
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentIcon = (icon: string) => {
    switch (icon) {
      case 'paypal':
        return '🅿️';
      case 'mercado':
        return '🟡';
      case 'crypto':
        return '₿';
      case 'bank':
        return '🏦';
      default:
        return '💳';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity pointer-events-auto"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CreditCard size={24} className="text-white" />
              <h2 className="text-lg sm:text-2xl font-bold text-white">Selecciona Método de Pago</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-1.5 sm:p-2 transition flex-shrink-0"
              disabled={isLoading}
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-6 md:p-8">
            {/* Left: Payment Methods */}
            <div className="lg:col-span-2 space-y-4">
              {/* Payment Methods */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Métodos de Pago</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedMethod === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        disabled={!method.enabled}
                        className="w-4 h-4"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getPaymentIcon(method.icon)}</span>
                          <div>
                            <p className="text-sm sm:text-base font-semibold text-gray-900">
                              {method.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Alternative Payment Options */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Opciones Adicionales</h4>

                {/* Gift Card */}
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={useGiftCard}
                    onChange={(e) => setUseGiftCard(e.target.checked)}
                    disabled
                    className="w-4 h-4 opacity-50"
                  />
                  <div className="flex-1 flex items-center gap-2">
                    <Gift size={20} className="text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Usar Tarjeta de Regalo</p>
                      <p className="text-xs text-gray-600">Coming Soon</p>
                    </div>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                    Phase 2
                  </span>
                </label>

                {/* Wallet */}
                {(checkoutData.walletBalance || 0) > 0 && (
                  <label className="flex items-center gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Usar Billetera Virtual</p>
                      <p className="text-xs text-gray-600">
                        Saldo disponible: ${checkoutData.walletBalance?.toFixed(2)}
                      </p>
                    </div>
                    <Wallet size={20} className="text-blue-600" />
                  </label>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 p-4 sm:p-6 bg-gray-50 border-gray-200">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Resumen de Orden</h3>

                {/* Cart Items */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs sm:text-sm">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-gray-600">x{item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>${checkoutData.subtotal.toFixed(2)}</span>
                  </div>

                  {checkoutData.couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Descuento (Cupón):</span>
                      <span>-${checkoutData.couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span>Impuestos (8%):</span>
                    <span>${checkoutData.tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Envío:</span>
                    <span>${checkoutData.shippingCost.toFixed(2)}</span>
                  </div>

                  {useWallet && walletAmount > 0 && (
                    <div className="flex justify-between text-blue-600 font-medium">
                      <span>Billetera:</span>
                      <span>-${walletAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-base sm:text-lg text-gray-900 pt-2 border-t border-gray-300">
                    <span>Total:</span>
                    <span className="text-green-600">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handlePaymentSubmit}
                  disabled={isLoading || finalTotal <= 0}
                  className="w-full h-10 sm:h-11 bg-gradient-to-r from-green-600 to-green-700 hover:shadow-lg disabled:opacity-50 text-white font-semibold mt-6 sm:mt-8"
                >
                  {isLoading ? 'Procesando...' : `Pagar $${finalTotal.toFixed(2)}`}
                </Button>

                {/* Info */}
                <p className="text-xs text-gray-600 mt-3 text-center">
                  Tu pago es seguro y encriptado
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
