'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';

// Validación con Zod
const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Nombre requerido').min(1, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido').min(1, 'Apellido requerido'),
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  phone: z.string().min(10, 'Teléfono inválido').min(1, 'Teléfono requerido'),
  address: z.string().min(5, 'Dirección requerida').min(1, 'Dirección requerida'),
  city: z.string().min(2, 'Ciudad requerida').min(1, 'Ciudad requerida'),
  state: z.string().min(2, 'Estado/Provincia requerido').min(1, 'Estado/Provincia requerido'),
  zipCode: z.string().min(3, 'Código postal requerido').min(1, 'Código postal requerido'),
  country: z.string().min(2, 'País requerido').min(1, 'País requerido'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
  productKind?: 'physical' | 'digital';
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  days: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  shippingOptions?: ShippingOption[];
  onSubmit?: (data: CheckoutFormValues) => void;
  onPaymentClick?: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  cartItems = [],
  shippingOptions = [
    { id: 'free', name: 'Envío Gratis (7-10 días)', price: 0, days: '7-10' },
    { id: 'standard', name: 'Envío Estándar (5-7 días)', price: 10, days: '5-7' },
    { id: 'express', name: 'Envío Express (2-3 días)', price: 25, days: '2-3' },
  ],
  onSubmit,
  onPaymentClick,
}: CheckoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]?.id || 'free');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Detectar si TODOS los items son digitales
  const allDigital = cartItems.every(item => item.productKind === 'digital');
  const showShippingSection = !allDigital;

  // Calcular totales
  const selectedOption = shippingOptions.find(opt => opt.id === selectedShipping) || shippingOptions[0];
  const shipping = showShippingSection ? (selectedOption?.price || 10) : 0;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = (subtotal - couponDiscount) * 0.08; // 8% tax
  const total = subtotal - couponDiscount + tax + shipping;

  const handleApplyCoupon = async () => {
    setCouponError('');
    
    if (!couponCode.trim()) {
      setCouponError('Ingresa un código de cupón');
      return;
    }

    // Mock: simular validación de cupón
    // En producción, esto llamaría a /api/v1/coupons/validate
    if (couponCode.toUpperCase() === 'DEMO20') {
      const discount = subtotal * 0.20; // 20% descuento
      setCouponDiscount(discount);
      setCouponCode('');
    } else if (couponCode.toUpperCase() === 'DEMO10') {
      const discount = subtotal * 0.10; // 10% descuento
      setCouponDiscount(discount);
      setCouponCode('');
    } else {
      setCouponError('Código de cupón inválido');
    }
  };

  // React Hook Form con Zod
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  const handleSubmitForm = async (values: CheckoutFormValues) => {
    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      // Luego mostrar PaymentModal
      if (onPaymentClick) {
        setTimeout(() => onPaymentClick(), 500);
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
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
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPin size={24} className="text-white" />
              <h2 className="text-lg sm:text-2xl font-bold text-white">Checkout</h2>
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
            {/* Left: Form */}
            <div className="lg:col-span-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Dirección de Envío</h3>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold">Nombre</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Juan"
                              {...field}
                              disabled={isLoading}
                              className="text-xs sm:text-sm h-9 sm:h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold">Apellido</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="García"
                              {...field}
                              disabled={isLoading}
                              className="text-xs sm:text-sm h-9 sm:h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="juan@example.com"
                              {...field}
                              disabled={isLoading}
                              className="text-xs sm:text-sm h-9 sm:h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold">Teléfono</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1 (786) 391-8722"
                              {...field}
                              disabled={isLoading}
                              className="text-xs sm:text-sm h-9 sm:h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm font-semibold">Dirección</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Main Street"
                            {...field}
                            disabled={isLoading}
                            className="text-xs sm:text-sm h-9 sm:h-10"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold">Ciudad</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Miami"
                              {...field}
                              disabled={isLoading}
                              className="text-xs sm:text-sm h-9 sm:h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold">Estado</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="FL"
                              {...field}
                              disabled={isLoading}
                              className="text-xs sm:text-sm h-9 sm:h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold">Código Postal</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="33101"
                              {...field}
                              disabled={isLoading}
                              className="text-xs sm:text-sm h-9 sm:h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Country */}
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm font-semibold">País</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="United States"
                            {...field}
                            disabled={isLoading}
                            className="text-xs sm:text-sm h-9 sm:h-10"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Discounts Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 p-4 bg-blue-50 rounded-lg border-b border-blue-200">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900">Descuentos y Pagos</h4>
                    
                    {/* Cupones */}
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700">Código de Cupón</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ej: DEMO20, DEMO10"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="text-xs sm:text-sm h-9 sm:h-10"
                        />
                        <Button
                          type="button"
                          onClick={handleApplyCoupon}
                          variant="outline"
                          className="whitespace-nowrap text-xs sm:text-sm h-9 sm:h-10"
                        >
                          Aplicar
                        </Button>
                      </div>
                      {couponError && <p className="text-xs text-red-600">{couponError}</p>}
                      {couponDiscount > 0 && (
                        <p className="text-xs text-green-600 font-medium">
                          ✓ Descuento aplicado: -${couponDiscount.toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Gift Card */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 opacity-50 cursor-not-allowed">
                        <input type="checkbox" disabled className="w-4 h-4" />
                        <span>Usar Tarjeta de Regalo</span>
                        <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                          Coming Soon
                        </span>
                      </label>
                    </div>

                    {/* Billetera */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 opacity-50 cursor-not-allowed">
                        <input type="checkbox" disabled className="w-4 h-4" />
                        <span>Usar Billetera Virtual</span>
                        <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                          Coming Soon
                        </span>
                      </label>
                    </div>
                  </div>
                  {/* Shipping Method - Solo si hay items físicos */}
                  {showShippingSection && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Método de Envío</h4>
                      <div className="space-y-2">
                        {shippingOptions.map((option) => (
                          <label key={option.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input 
                              type="radio" 
                              name="shipping" 
                              value={option.id}
                              checked={selectedShipping === option.id}
                              onChange={(e) => setSelectedShipping(e.target.value)}
                              className="w-4 h-4" 
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{option.name}</p>
                              <p className="text-xs text-gray-600">${option.price.toFixed(2)}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {!showShippingSection && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-blue-900">✓ Entrega Instantánea</p>
                        <p className="text-xs text-blue-700 mt-1">Recibirás el acceso al instante después de completar el pago</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 sm:h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg disabled:opacity-50 text-white font-semibold mt-6 sm:mt-8"
                  >
                    {isLoading ? 'Procesando...' : 'Proceder al Pago'}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                <Card className="p-4 sm:p-6 bg-gray-50 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package size={20} />
                    Resumen
                  </h3>

                  {/* Items */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 max-h-48 overflow-y-auto">
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                            <p className="text-xs text-gray-600">x{item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">Carrito vacío</p>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Impuestos (8%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Envío:</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between text-base font-bold text-gray-900">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckoutModal;
