'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import type { Product } from '../data/products';

// Validación con Zod
const shippingSchema = z.object({
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Teléfono inválido'),
  address: z.string().min(5, 'Dirección requerida'),
  district: z.string().min(2, 'Distrito requerido'),
  canton: z.string().min(2, 'Cantón requerido'),
  province: z.string().min(2, 'Provincia requerida'),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

export type { ShippingFormValues };

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedSize: { us: string; eu: string };
  onSubmit: (data: ShippingFormValues & { product: Product; selectedSize: { us: string; eu: string } }) => void;
}

const CR_PROVINCES = [
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón',
];

const CR_CANTONS: Record<string, string[]> = {
  'San José': ['Central', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú'],
  'Alajuela': ['Central', 'San Ramón', 'Grecia', 'San Isidro', 'Naranjo'],
  'Cartago': ['Central', 'La Unión', 'Jiménez', 'Turrialba', 'Oreamuno'],
  'Heredia': ['Central', 'Santo Domingo', 'Santa Bárbara', 'San Rafael', 'Sarapiquí'],
  'Guanacaste': ['Liberia', 'Nicoya', 'Santa Cruz', 'Bagaces', 'Tilarán'],
  'Puntarenas': ['Central', 'Esparza', 'Orotina', 'San Mateo', 'Parrita'],
  'Limón': ['Central', 'Pococí', 'Siquirres', 'Talamanca', 'Matina'],
};

export function ShippingModal({
  isOpen,
  onClose,
  product,
  selectedSize,
  onSubmit,
}: ShippingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>('San José');

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      district: '',
      canton: CR_CANTONS['San José']?.[0] || '',
      province: 'San José',
    },
  });

  const handleSubmitForm = async (data: ShippingFormValues) => {
    setIsLoading(true);
    try {
      onSubmit({
        ...data,
        product,
        selectedSize,
      });
    } catch (err) {
      console.error('Shipping form error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    form.setValue('province', province);
    form.setValue('canton', CR_CANTONS[province]?.[0] || '');
  };

  if (!isOpen) return null;

  const cantons = CR_CANTONS[selectedProvince] || [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity pointer-events-auto"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90dvh] overflow-y-auto pointer-events-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPin size={24} className="text-white" />
              <h2 className="text-lg sm:text-2xl font-bold text-white">Dirección de Envío</h2>
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
              <Form {...form}>
                <form id="shipping-form" onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
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
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="juan@mail.com"
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
                          <FormLabel className="text-xs sm:text-sm font-semibold">Celular</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+506 8765 4321"
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
                        <FormLabel className="text-xs sm:text-sm font-semibold">Dirección Exacta</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Calle Principal 123, Casa 45"
                            {...field}
                            disabled={isLoading}
                            className="text-xs sm:text-sm h-9 sm:h-10"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Distrito */}
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm font-semibold">Distrito</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="San José"
                            {...field}
                            disabled={isLoading}
                            className="text-xs sm:text-sm h-9 sm:h-10"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Province & Canton */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-2">Provincia</label>
                      <select
                        value={selectedProvince}
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {CR_PROVINCES.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>

                    <FormField
                      control={form.control}
                      name="canton"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold">Cantón</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              disabled={isLoading}
                              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              {cantons.map((canton) => (
                                <option key={canton} value={canton}>
                                  {canton}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                </form>
              </Form>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
              <Card className="p-4 sm:p-6 border-2 border-blue-100 sticky top-[80px] bg-blue-50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-2xl">📦</div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Consulta de Disponibilidad</h3>
                </div>

                {/* Product Info */}
                <div className="mb-6 pb-6 border-b border-blue-200">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Producto</p>
                      <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Talla</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedSize.us}US / {selectedSize.eu}EU</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Precio</p>
                      <p className="text-base font-bold text-orange-600">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Info Message */}
                <div className="bg-white border border-blue-300 rounded-lg p-4 mb-4">
                  <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">ℹ️ Próximos pasos:</p>
                  <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                    <li>✓ Recibimos tus datos</li>
                    <li>✓ Conversamos por WhatsApp</li>
                    <li>✓ Confirmamos disponibilidad</li>
                    <li>✓ Finaliza la compra en WhatsApp</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  form="shipping-form"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 mb-4"
                >
                  {isLoading ? 'Guardando...' : 'Obtener Envío Gratis'}
                </Button>

                
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShippingModal;
