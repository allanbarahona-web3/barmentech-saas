'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export type Language = 'es' | 'en';

const translations = {
  es: {
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
  },
  en: {
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
  },
};

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

interface OrdersTableProps {
  orders: Order[];
  onEdit?: (order: Order) => void;
  onDelete?: (orderId: string) => void;
  onViewDetails?: (order: Order) => void;
  isLoading?: boolean;
  language?: Language;
}

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function OrdersTable({
  orders,
  onEdit,
  onDelete,
  onViewDetails,
  isLoading = false,
  language = 'es',
}: OrdersTableProps) {
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const t = translations[language];

  const sortedOrders = [...orders].sort((a, b) => {
    let compareValue = 0;
    if (sortBy === 'date') {
      compareValue = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'total') {
      compareValue = a.total - b.total;
    }
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  if (isLoading) {
    return <div className="text-center py-8">{t.loadingOrders}</div>;
  }

  if (orders.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">{t.noOrders}</p>
      </Card>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Card>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg">{t.orders}</h3>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'total')}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="date">{t.sortByDate}</option>
              <option value="total">{t.sortByTotal}</option>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.orderNumber}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.customer}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.email}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.items}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.total}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.status}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.date}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-blue-600">#{order.orderNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {t[order.status as keyof typeof t]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  {onViewDetails && (
                    <Button size="sm" variant="outline" onClick={() => onViewDetails(order)}>
                      {t.view}
                    </Button>
                  )}
                  {onEdit && (
                    <Button size="sm" variant="outline" onClick={() => onEdit(order)}>
                      {t.edit}
                    </Button>
                  )}
                  {onDelete && (
                    <Button size="sm" variant="destructive" onClick={() => onDelete(order.id)}>
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
