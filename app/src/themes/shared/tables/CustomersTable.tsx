'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export type Language = 'es' | 'en';

const translations = {
  es: {
    customers: 'Clientes',
    name: 'Cliente',
    email: 'Email',
    phone: 'Teléfono',
    city: 'Ubicación',
    country: 'País',
    totalOrders: 'Órdenes',
    totalSpent: 'Gasto Total',
    joinDate: 'Miembro desde',
    searchPlaceholder: 'Buscar por nombre o email...',
    loadingCustomers: 'Cargando clientes...',
    noCustomers: 'No hay clientes para mostrar',
    active: 'Activo',
    inactive: 'Inactivo',
    vip: 'VIP',
    sortByName: 'Ordenar por Nombre',
    sortBySpent: 'Ordenar por Gasto Total',
    sortByDate: 'Ordenar por Fecha de Registro',
    actions: 'Acciones',
    total: 'Total',
    of: 'de',
    view: 'Ver',
    edit: 'Editar',
    delete: 'Borrar',
    status: 'Estado',
  },
  en: {
    customers: 'Customers',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    city: 'Location',
    country: 'Country',
    totalOrders: 'Orders',
    totalSpent: 'Total Spent',
    joinDate: 'Member Since',
    searchPlaceholder: 'Search by name or email...',
    loadingCustomers: 'Loading customers...',
    noCustomers: 'No customers to display',
    active: 'Active',
    inactive: 'Inactive',
    vip: 'VIP',
    sortByName: 'Sort by Name',
    sortBySpent: 'Sort by Total Spent',
    sortByDate: 'Sort by Join Date',
    actions: 'Actions',
    total: 'Total',
    of: 'of',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    status: 'Status',
  },
};

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'vip';
}

interface CustomersTableProps {
  customers: Customer[];
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
  onViewDetails?: (customer: Customer) => void;
  isLoading?: boolean;
  language?: Language;
}

const statusColors: Record<Customer['status'], string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  vip: 'bg-purple-100 text-purple-800',
};

export function CustomersTable({
  customers,
  onEdit,
  onDelete,
  onViewDetails,
  isLoading = false,
  language = 'es',
}: CustomersTableProps) {
  const [sortBy, setSortBy] = useState<'name' | 'totalSpent' | 'joinDate'>('joinDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const t = translations[language];

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let compareValue = 0;
    if (sortBy === 'name') {
      compareValue = a.name.localeCompare(b.name);
    } else if (sortBy === 'totalSpent') {
      compareValue = a.totalSpent - b.totalSpent;
    } else if (sortBy === 'joinDate') {
      compareValue = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
    }
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  if (isLoading) {
    return <div className="text-center py-8">{t.loadingCustomers}</div>;
  }

  if (customers.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">{t.noCustomers}</p>
      </Card>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Card>
        <div className="p-4 border-b space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{t.customers}</h3>
            <div className="text-sm text-gray-600">
              {t.total}: {sortedCustomers.length} {t.of} {customers.length}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 border rounded text-sm flex-1 min-w-48"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'totalSpent' | 'joinDate')}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="name">{t.sortByName}</option>
              <option value="totalSpent">{t.sortBySpent}</option>
              <option value="joinDate">{t.sortByDate}</option>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.name}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.email}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.phone}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.city}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.totalOrders}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.totalSpent}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.joinDate}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.status}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomers.map((customer) => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{customer.phone || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {customer.city && customer.country ? `${customer.city}, ${customer.country}` : '-'}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{customer.totalOrders}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">${customer.totalSpent.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(customer.joinDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[customer.status]}`}>
                    {t[customer.status as keyof typeof t]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  {onViewDetails && (
                    <Button size="sm" variant="outline" onClick={() => onViewDetails(customer)}>
                      {t.view}
                    </Button>
                  )}
                  {onEdit && (
                    <Button size="sm" variant="outline" onClick={() => onEdit(customer)}>
                      {t.edit}
                    </Button>
                  )}
                  {onDelete && (
                    <Button size="sm" variant="destructive" onClick={() => onDelete(customer.id)}>
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
