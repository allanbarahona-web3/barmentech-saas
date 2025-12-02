'use client';

import { useState } from 'react';
import { OrdersTable, ProductsTable, CustomersTable } from '@/src/themes/shared/tables';
import type { Order, Product, Customer } from '@/src/themes/shared/tables';

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '001',
    customer: 'Juan García',
    email: 'juan@example.com',
    total: 250.99,
    status: 'delivered',
    date: '2024-01-15',
    items: 3,
  },
  {
    id: '2',
    orderNumber: '002',
    customer: 'María López',
    email: 'maria@example.com',
    total: 450.50,
    status: 'shipped',
    date: '2024-01-18',
    items: 5,
  },
  {
    id: '3',
    orderNumber: '003',
    customer: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    total: 150.00,
    status: 'processing',
    date: '2024-01-20',
    items: 2,
  },
  {
    id: '4',
    orderNumber: '004',
    customer: 'Ana Martínez',
    email: 'ana@example.com',
    total: 899.99,
    status: 'pending',
    date: '2024-01-21',
    items: 8,
  },
  {
    id: '5',
    orderNumber: '005',
    customer: 'Roberto Torres',
    email: 'roberto@example.com',
    total: 75.50,
    status: 'cancelled',
    date: '2024-01-19',
    items: 1,
  },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    sku: 'WH-001',
    category: 'Electronics',
    price: 79.99,
    stock: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
  },
  {
    id: '2',
    name: 'USB-C Cable',
    sku: 'USB-001',
    category: 'Accessories',
    price: 12.99,
    stock: 150,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop',
  },
  {
    id: '3',
    name: 'Premium Phone Case',
    sku: 'PC-001',
    category: 'Accessories',
    price: 34.99,
    stock: 3,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500&h=500&fit=crop',
  },
  {
    id: '4',
    name: 'Tactical Knife',
    sku: 'TK-001',
    category: 'Tactical',
    price: 129.99,
    stock: 0,
    status: 'inactive',
  },
  {
    id: '5',
    name: 'LED Flashlight',
    sku: 'LED-001',
    category: 'Lighting',
    price: 45.50,
    stock: 8,
    status: 'active',
  },
  {
    id: '6',
    name: 'Backpack Pro',
    sku: 'BP-001',
    category: 'Bags',
    price: 189.99,
    stock: 5,
    status: 'draft',
  },
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Juan García',
    email: 'juan@example.com',
    phone: '+506 8765 4321',
    city: 'San José',
    country: 'Costa Rica',
    totalOrders: 5,
    totalSpent: 1250.99,
    joinDate: '2023-06-15',
    status: 'vip',
  },
  {
    id: '2',
    name: 'María López',
    email: 'maria@example.com',
    phone: '+506 8765 4322',
    city: 'San José',
    country: 'Costa Rica',
    totalOrders: 3,
    totalSpent: 450.50,
    joinDate: '2023-09-10',
    status: 'active',
  },
  {
    id: '3',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    phone: '+1 305 555 1234',
    city: 'Miami',
    country: 'United States',
    totalOrders: 1,
    totalSpent: 150.00,
    joinDate: '2024-01-01',
    status: 'active',
  },
  {
    id: '4',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    totalOrders: 0,
    totalSpent: 0,
    joinDate: '2024-01-20',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Roberto Torres',
    email: 'roberto@example.com',
    phone: '+1 212 555 5678',
    city: 'New York',
    country: 'United States',
    totalOrders: 12,
    totalSpent: 3500.99,
    joinDate: '2022-03-15',
    status: 'vip',
  },
];

export default function TablesTestPage() {
  const [activeTable, setActiveTable] = useState<'orders' | 'products' | 'customers'>('orders');
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  const handleEdit = (item: any) => {
    console.log('Edit:', item);
  };

  const handleDelete = (id: string) => {
    console.log('Delete:', id);
  };

  const handleViewDetails = (item: any) => {
    console.log('View Details:', item);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tablas Compartidas Test</h1>
          <p className="text-gray-600">Componentes de tabla reutilizables para todos los proyectos</p>
        </div>

        {/* Botones de navegación */}
        <div className="flex gap-4 mb-8 flex-wrap items-center">
          <button
            onClick={() => setActiveTable('orders')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTable === 'orders'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            📋 Órdenes ({mockOrders.length})
          </button>
          <button
            onClick={() => setActiveTable('products')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTable === 'products'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            🛍️ Productos ({mockProducts.length})
          </button>
          <button
            onClick={() => setActiveTable('customers')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTable === 'customers'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            👥 Clientes ({mockCustomers.length})
          </button>

          {/* Language toggle */}
          <div className="ml-auto flex gap-2 border rounded-lg p-1">
            <button
              onClick={() => setLanguage('es')}
              className={`px-4 py-2 rounded font-semibold transition ${
                language === 'es' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'
              }`}
            >
              🇪🇸 ES
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded font-semibold transition ${
                language === 'en' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'
              }`}
            >
              🇺🇸 EN
            </button>
          </div>
        </div>

        {/* Tablas */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTable === 'orders' && (
            <OrdersTable
              orders={mockOrders}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              language={language}
            />
          )}

          {activeTable === 'products' && (
            <ProductsTable
              products={mockProducts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              language={language}
            />
          )}

          {activeTable === 'customers' && (
            <CustomersTable
              customers={mockCustomers}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              language={language}
            />
          )}
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Características</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Sorting por múltiples columnas (asc/desc)</li>
            <li>✅ Filtrado (categorías, búsqueda)</li>
            <li>✅ Diseño responsive</li>
            <li>✅ Botones de acciones (Ver, Editar, Borrar)</li>
            <li>✅ Estados con colores</li>
            <li>✅ Comparte con todos los proyectos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
