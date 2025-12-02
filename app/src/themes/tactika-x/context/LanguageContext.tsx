'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'es' | 'en';

interface TableTranslations {
  // OrdersTable
  orders: string;
  orderNumber: string;
  customer: string;
  email: string;
  items: string;
  total: string;
  status: string;
  date: string;
  actions: string;
  sortByDate: string;
  sortByTotal: string;
  loadingOrders: string;
  noOrders: string;
  pending: string;
  processing: string;
  shipped: string;
  delivered: string;
  cancelled: string;
  view: string;
  edit: string;
  delete: string;
  
  // ProductsTable
  products: string;
  product: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  statusLabel: string;
  active: string;
  inactive: string;
  draft: string;
  allCategories: string;
  sortByName: string;
  sortByPrice: string;
  sortByStock: string;
  loadingProducts: string;
  noProducts: string;
  units: string;
  
  // CustomersTable
  customers: string;
  name: string;
  phone: string;
  city: string;
  country: string;
  totalOrders: string;
  totalSpent: string;
  joinDate: string;
  searchPlaceholder: string;
  loadingCustomers: string;
  noCustomers: string;
  vip: string;
  of: string;
}

interface Translations extends TableTranslations {
  [key: string]: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const translations: Record<Language, Translations> = {
  es: {
    // Tabla general
    orders: 'Órdenes',
    orderNumber: 'Nro. Orden',
    customer: 'Cliente',
    email: 'Email',
    items: 'Items',
    total: 'Total',
    status: 'Estado',
    date: 'Fecha',
    actions: 'Acciones',
    sortByDate: 'Ordenar por Fecha',
    sortByTotal: 'Ordenar por Total',
    loadingOrders: 'Cargando órdenes...',
    noOrders: 'No hay órdenes para mostrar',
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
    view: 'Ver',
    edit: 'Editar',
    delete: 'Borrar',
    
    // Productos
    products: 'Productos',
    product: 'Producto',
    sku: 'SKU',
    category: 'Categoría',
    price: 'Precio',
    stock: 'Stock',
    statusLabel: 'Estado',
    active: 'Activo',
    inactive: 'Inactivo',
    draft: 'Borrador',
    allCategories: 'Todas las Categorías',
    sortByName: 'Ordenar por Nombre',
    sortByPrice: 'Ordenar por Precio',
    sortByStock: 'Ordenar por Stock',
    loadingProducts: 'Cargando productos...',
    noProducts: 'No hay productos para mostrar',
    units: 'unidades',
    
    // Clientes
    customers: 'Clientes',
    name: 'Cliente',
    phone: 'Teléfono',
    city: 'Ubicación',
    country: 'País',
    totalOrders: 'Órdenes',
    totalSpent: 'Gasto Total',
    joinDate: 'Miembro desde',
    searchPlaceholder: 'Buscar por nombre o email...',
    loadingCustomers: 'Cargando clientes...',
    noCustomers: 'No hay clientes para mostrar',
    vip: 'VIP',
    of: 'de',
  },
  en: {
    // Tabla general
    orders: 'Orders',
    orderNumber: 'Order #',
    customer: 'Customer',
    email: 'Email',
    items: 'Items',
    total: 'Total',
    status: 'Status',
    date: 'Date',
    actions: 'Actions',
    sortByDate: 'Sort by Date',
    sortByTotal: 'Sort by Total',
    loadingOrders: 'Loading orders...',
    noOrders: 'No orders to display',
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    
    // Productos
    products: 'Products',
    product: 'Product',
    sku: 'SKU',
    category: 'Category',
    price: 'Price',
    stock: 'Stock',
    statusLabel: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    draft: 'Draft',
    allCategories: 'All Categories',
    sortByName: 'Sort by Name',
    sortByPrice: 'Sort by Price',
    sortByStock: 'Sort by Stock',
    loadingProducts: 'Loading products...',
    noProducts: 'No products to display',
    units: 'units',
    
    // Clientes
    customers: 'Customers',
    name: 'Name',
    phone: 'Phone',
    city: 'Location',
    country: 'Country',
    totalOrders: 'Orders',
    totalSpent: 'Total Spent',
    joinDate: 'Member Since',
    searchPlaceholder: 'Search by name or email...',
    loadingCustomers: 'Loading customers...',
    noCustomers: 'No customers to display',
    vip: 'VIP',
    of: 'of',
  },
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
