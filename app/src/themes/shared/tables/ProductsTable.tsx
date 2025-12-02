'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export type Language = 'es' | 'en';

const translations = {
  es: {
    products: 'Productos',
    product: 'Producto',
    sku: 'SKU',
    category: 'Categoría',
    price: 'Precio',
    stock: 'Stock',
    status: 'Estado',
    actions: 'Acciones',
    allCategories: 'Todas las Categorías',
    sortByName: 'Ordenar por Nombre',
    sortByPrice: 'Ordenar por Precio',
    sortByStock: 'Ordenar por Stock',
    loadingProducts: 'Cargando productos...',
    noProducts: 'No hay productos para mostrar',
    active: 'Activo',
    inactive: 'Inactivo',
    draft: 'Borrador',
    units: 'unidades',
    total: 'Total',
    of: 'de',
    view: 'Ver',
    edit: 'Editar',
    delete: 'Borrar',
  },
  en: {
    products: 'Products',
    product: 'Product',
    sku: 'SKU',
    category: 'Category',
    price: 'Price',
    stock: 'Stock',
    status: 'Status',
    actions: 'Actions',
    allCategories: 'All Categories',
    sortByName: 'Sort by Name',
    sortByPrice: 'Sort by Price',
    sortByStock: 'Sort by Stock',
    loadingProducts: 'Loading products...',
    noProducts: 'No products to display',
    active: 'Active',
    inactive: 'Inactive',
    draft: 'Draft',
    units: 'units',
    total: 'Total',
    of: 'of',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
  },
};

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  image?: string;
}

interface ProductsTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onViewDetails?: (product: Product) => void;
  isLoading?: boolean;
  language?: Language;
}

const statusColors: Record<Product['status'], string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  draft: 'bg-yellow-100 text-yellow-800',
};

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  onViewDetails,
  isLoading = false,
  language = 'es',
}: ProductsTableProps) {
  const [sortBy, setSortBy] = useState<'price' | 'stock' | 'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const t = translations[language];

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((p) => filterCategory === 'all' || p.category === filterCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let compareValue = 0;
    if (sortBy === 'price') {
      compareValue = a.price - b.price;
    } else if (sortBy === 'stock') {
      compareValue = a.stock - b.stock;
    } else if (sortBy === 'name') {
      compareValue = a.name.localeCompare(b.name);
    }
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  if (isLoading) {
    return <div className="text-center py-8">{t.loadingProducts}</div>;
  }

  if (products.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">{t.noProducts}</p>
      </Card>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Card>
        <div className="p-4 border-b space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{t.products}</h3>
            <div className="text-sm text-gray-600">
              {t.total}: {sortedProducts.length} {t.of} {products.length}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="all">{t.allCategories}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'stock' | 'name')}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="name">{t.sortByName}</option>
              <option value="price">{t.sortByPrice}</option>
              <option value="stock">{t.sortByStock}</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.product}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.sku}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.category}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.price}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.stock}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.status}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                    )}
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stock} {t.units}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}>
                    {t[product.status as keyof typeof t]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  {onViewDetails && (
                    <Button size="sm" variant="outline" onClick={() => onViewDetails(product)}>
                      {t.view}
                    </Button>
                  )}
                  {onEdit && (
                    <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
                      {t.edit}
                    </Button>
                  )}
                  {onDelete && (
                    <Button size="sm" variant="destructive" onClick={() => onDelete(product.id)}>
                      {t.delete}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
